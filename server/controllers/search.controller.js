import Profile from "../models/Profile.model.js";
import Job from "../models/Job.model.js";
import Service from "../models/Service.model.js";
import { Skill } from "../models/Skill.model.js";

export const search = async (req, res) => {
  try {
    const {
      q,
      type = "all",
      location,
      industry,
      skills,
      category,
      mode,
      minExperience,
      proficiencyLevel,
      sortBy = "relevance",
      page = 1,
      limit = 20,
    } = req.query;

    if (!q && !location && !industry && !skills && !category) {
      return res.status(400).json({
        success: false,
        message: "At least one search parameter is required",
      });
    }

    const results = {
      people: [],
      jobs: [],
      services: [],
      totalCount: {
        people: 0,
        jobs: 0,
        services: 0,
      },
    };

    // Build search conditions
    const buildTextSearchConditions = (searchTerm) => {
      if (!searchTerm) return [];
      const escapedQ = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedQ, "i");
      return searchRegex;
    };

    const searchRegex = q ? buildTextSearchConditions(q) : null;

    // Parse location filter
    const locationFilter = location
      ? JSON.parse(decodeURIComponent(location))
      : null;

    // Parse skills array
    const skillsArray = skills ? skills.split(",").map((s) => s.trim()) : null;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // SEARCH PEOPLE
    if (type === "all" || type === "people") {
      const peopleConditions = { $and: [] };

      // Text search
      if (searchRegex) {
        peopleConditions.$and.push({
          $or: [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { headline: searchRegex },
            { industry: searchRegex },
            { about: searchRegex },
          ],
        });
      }

      // Location filter
      if (locationFilter) {
        const locConditions = [];
        if (locationFilter.city) {
          locConditions.push({
            "location.city": new RegExp(locationFilter.city, "i"),
          });
        }
        if (locationFilter.country) {
          locConditions.push({
            "location.country": new RegExp(locationFilter.country, "i"),
          });
        }
        if (locConditions.length > 0) {
          peopleConditions.$and.push({ $or: locConditions });
        }
      }

      // Industry filter
      if (industry) {
        peopleConditions.$and.push({
          industry: new RegExp(industry, "i"),
        });
      }

      const finalPeopleConditions =
        peopleConditions.$and.length > 0 ? peopleConditions : {};

      // Get total count
      results.totalCount.people = await Profile.countDocuments(
        finalPeopleConditions
      );

      // Get people with populated user data
      let peopleQuery = Profile.find(finalPeopleConditions)
        .populate({
          path: "userId",
          select: "slug email isVerified accountType",
        })
        .skip(skip)
        .limit(limitNum);

      // Sorting
      if (sortBy === "newest") {
        peopleQuery = peopleQuery.sort({ createdAt: -1 });
      } else if (sortBy === "verified") {
        peopleQuery = peopleQuery.sort({ isVerified: -1, createdAt: -1 });
      }

      const people = await peopleQuery.lean();

      // If skills filter is applied, get user skills and filter
      if (skillsArray && skillsArray.length > 0 && people.length > 0) {
        const userIds = people.map((p) => p.userId._id);
        const userSkills = await Skill.find({
          userId: { $in: userIds },
          name: {
            $in: skillsArray.map((s) => new RegExp(s, "i")),
          },
        }).lean();

        // Create a map of userId to matched skills count
        const skillsMap = {};
        userSkills.forEach((skill) => {
          const uid = skill.userId.toString();
          skillsMap[uid] = (skillsMap[uid] || 0) + 1;
        });

        // Filter and sort people by skill match count
        results.people = people
          .map((person) => {
            const uid = person.userId._id.toString();
            return {
              ...person,
              matchedSkillsCount: skillsMap[uid] || 0,
            };
          })
          .filter((p) => p.matchedSkillsCount > 0)
          .sort((a, b) => b.matchedSkillsCount - a.matchedSkillsCount);

        results.totalCount.people = results.people.length;
      } else {
        results.people = people;
      }
    }

    // SEARCH JOBS
    if (type === "all" || type === "jobs") {
      const jobConditions = { $and: [{ status: "active" }] };

      // Text search
      if (searchRegex) {
        jobConditions.$and.push({
          $or: [
            { title: searchRegex },
            { description: searchRegex },
            { industry: searchRegex },
            { category: searchRegex },
            { skillsRequired: searchRegex },
            { servicesOffered: searchRegex },
          ],
        });
      }

      // Location filter
      if (locationFilter) {
        const locConditions = [];
        if (locationFilter.city) {
          locConditions.push({
            "location.city": new RegExp(locationFilter.city, "i"),
          });
        }
        if (locationFilter.country) {
          locConditions.push({
            "location.country": new RegExp(locationFilter.country, "i"),
          });
        }
        if (locConditions.length > 0) {
          jobConditions.$and.push({ $or: locConditions });
        }
      }

      // Industry filter
      if (industry) {
        jobConditions.$and.push({ industry: new RegExp(industry, "i") });
      }

      // Category filter
      if (category) {
        jobConditions.$and.push({ category: new RegExp(category, "i") });
      }

      // Mode filter (hybrid, barter, paid)
      if (mode) {
        jobConditions.$and.push({ mode: mode });
      }

      // Skills filter
      if (skillsArray && skillsArray.length > 0) {
        jobConditions.$and.push({
          skillsRequired: {
            $in: skillsArray.map((s) => new RegExp(s, "i")),
          },
        });
      }

      const finalJobConditions =
        jobConditions.$and.length > 0 ? jobConditions : {};

      // Get total count
      results.totalCount.jobs = await Job.countDocuments(finalJobConditions);

      // Get jobs
      let jobsQuery = Job.find(finalJobConditions)
        .populate({
          path: "userId",
          select: "slug email isVerified accountType",
        })
        .skip(skip)
        .limit(limitNum);

      // Sorting
      if (sortBy === "newest") {
        jobsQuery = jobsQuery.sort({ createdAt: -1 });
      } else if (sortBy === "deadline") {
        jobsQuery = jobsQuery.sort({ applicationDeadline: 1 });
      } else if (sortBy === "popular") {
        jobsQuery = jobsQuery.sort({ views: -1 });
      }

      const jobs = await jobsQuery.lean();

      // Fetch poster profiles
      if (jobs.length > 0) {
        const userIds = jobs.map((j) => j.userId._id);
        const profiles = await Profile.find({ userId: { $in: userIds } }).lean();
        const profileMap = {};
        profiles.forEach((p) => (profileMap[p.userId.toString()] = p));

        results.jobs = jobs.map((job) => ({
          ...job,
          posterProfile: profileMap[job.userId._id.toString()] || null,
        }));
      }
    }

    // SEARCH SERVICES
    if (type === "all" || type === "services") {
      const serviceConditions = { $and: [{ isActive: true }] };

      // Text search
      if (searchRegex) {
        serviceConditions.$and.push({
          $or: [
            { name: searchRegex },
            { description: searchRegex },
            { category: searchRegex },
            { requirements: searchRegex },
          ],
        });
      }

      // Location filter
      if (locationFilter) {
        const locConditions = [];
        if (locationFilter.city) {
          locConditions.push({
            "location.city": new RegExp(locationFilter.city, "i"),
          });
        }
        if (locationFilter.country) {
          locConditions.push({
            "location.country": new RegExp(locationFilter.country, "i"),
          });
        }
        if (locConditions.length > 0) {
          serviceConditions.$and.push({ $or: locConditions });
        }
      }

      // Category filter
      if (category) {
        serviceConditions.$and.push({ category: category });
      }

      // Mode filter
      if (mode) {
        serviceConditions.$and.push({ modesAvailable: mode });
      }

      const finalServiceConditions =
        serviceConditions.$and.length > 0 ? serviceConditions : {};

      // Get total count
      results.totalCount.services = await Service.countDocuments(
        finalServiceConditions
      );

      // Get services
      let servicesQuery = Service.find(finalServiceConditions)
        .populate({
          path: "userId",
          select: "slug email isVerified accountType",
        })
        .skip(skip)
        .limit(limitNum);

      // Sorting
      if (sortBy === "newest") {
        servicesQuery = servicesQuery.sort({ createdAt: -1 });
      }

      const services = await servicesQuery.lean();

      // Fetch service provider profiles
      if (services.length > 0) {
        const userIds = services.map((s) => s.userId._id);
        const profiles = await Profile.find({ userId: { $in: userIds } }).lean();
        const profileMap = {};
        profiles.forEach((p) => (profileMap[p.userId.toString()] = p));

        results.services = services.map((service) => ({
          ...service,
          providerProfile: profileMap[service.userId._id.toString()] || null,
        }));
      }
    }

    // Calculate relevance scores if needed
    if (sortBy === "relevance" && q) {
      // Simple relevance scoring based on text match positions
      const calculateRelevance = (text, searchTerm) => {
        if (!text) return 0;
        const lowerText = text.toLowerCase();
        const lowerSearch = searchTerm.toLowerCase();
        const index = lowerText.indexOf(lowerSearch);
        if (index === -1) return 0;
        // Earlier matches get higher scores
        return 100 - index;
      };

      results.people = results.people.map((p) => ({
        ...p,
        _relevance:
          calculateRelevance(p.firstName, q) +
          calculateRelevance(p.lastName, q) +
          calculateRelevance(p.headline, q) * 2,
      }));

      results.jobs = results.jobs.map((j) => ({
        ...j,
        _relevance: calculateRelevance(j.title, q) * 3 + calculateRelevance(j.description, q),
      }));

      results.services = results.services.map((s) => ({
        ...s,
        _relevance: calculateRelevance(s.name, q) * 3 + calculateRelevance(s.description, q),
      }));

      // Sort by relevance
      results.people.sort((a, b) => b._relevance - a._relevance);
      results.jobs.sort((a, b) => b._relevance - a._relevance);
      results.services.sort((a, b) => b._relevance - a._relevance);
    }

    return res.status(200).json({
      success: true,
      data: results,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        hasMore: {
          people: results.people.length === limitNum,
          jobs: results.jobs.length === limitNum,
          services: results.services.length === limitNum,
        },
      },
    });
  } catch (error) {
    console.error("Search Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get search suggestions/autocomplete
export const searchSuggestions = async (req, res) => {
  try {
    const { q, type = "all" } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Query must be at least 2 characters",
      });
    }

    const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(`^${escapedQ}`, "i");

    const suggestions = {
      people: [],
      jobs: [],
      services: [],
      skills: [],
      locations: [],
      industries: [],
    };

    // Get people suggestions
    if (type === "all" || type === "people") {
      const people = await Profile.find({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { headline: searchRegex },
        ],
      })
        .select("firstName lastName headline profileImage")
        .populate("userId", "slug")
        .limit(5)
        .lean();

      suggestions.people = people.map((p) => ({
        type: "person",
        label: `${p.firstName} ${p.lastName}`,
        subtitle: p.headline,
        image: p.profileImage,
        slug: p.userId?.slug,
      }));
    }

    // Get job title suggestions
    if (type === "all" || type === "jobs") {
      const jobs = await Job.find({
        title: searchRegex,
        status: "active",
      })
        .select("title industry")
        .limit(5)
        .lean();

      suggestions.jobs = jobs.map((j) => ({
        type: "job",
        label: j.title,
        subtitle: j.industry,
      }));
    }

    // Get service suggestions
    if (type === "all" || type === "services") {
      const services = await Service.find({
        name: searchRegex,
        isActive: true,
      })
        .select("name category")
        .limit(5)
        .lean();

      suggestions.services = services.map((s) => ({
        type: "service",
        label: s.name,
        subtitle: s.category,
      }));
    }

    // Get skill suggestions
    const skills = await Skill.distinct("name", {
      name: searchRegex,
    });
    suggestions.skills = skills.slice(0, 5).map((s) => ({
      type: "skill",
      label: s,
    }));

    // Get location suggestions
    const cities = await Profile.distinct("location.city", {
      "location.city": searchRegex,
    });
    suggestions.locations = cities.slice(0, 5).map((c) => ({
      type: "location",
      label: c,
    }));

    // Get industry suggestions
    const industries = await Profile.distinct("industry", {
      industry: searchRegex,
    });
    suggestions.industries = industries.slice(0, 5).map((i) => ({
      type: "industry",
      label: i,
    }));

    return res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error("Suggestions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get filter options
export const getFilterOptions = async (req, res) => {
  try {
    const [industries, categories, skills, cities, countries] = await Promise.all([
      Profile.distinct("industry").then((data) => data.filter(Boolean)),
      Service.distinct("category").then((data) => data.filter(Boolean)),
      Skill.distinct("name").then((data) => data.filter(Boolean).slice(0, 100)),
      Profile.distinct("location.city").then((data) => data.filter(Boolean)),
      Profile.distinct("location.country").then((data) => data.filter(Boolean)),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        industries: industries.sort(),
        categories: categories.sort(),
        skills: skills.sort(),
        cities: cities.sort(),
        countries: countries.sort(),
        modes: ["paid", "hybrid", "barter"],
        proficiencyLevels: ["beginner", "intermediate", "advanced", "expert"],
        sortOptions: [
          { value: "relevance", label: "Most Relevant" },
          { value: "newest", label: "Newest First" },
          { value: "popular", label: "Most Popular" },
          { value: "deadline", label: "Deadline Soon" },
        ],
      },
    });
  } catch (error) {
    console.error("Filter Options Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};