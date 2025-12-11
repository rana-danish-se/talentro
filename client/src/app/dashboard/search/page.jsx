"use client";

export const dynamic = "force-dynamic";

import {
  Search,
  MapPin,
  Briefcase,
  User as UserIcon,
  Building2,
  Filter,
  X,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const SearchPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("all");
  const [results, setResults] = useState({
    people: [],
    jobs: [],
    services: [],
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterOptions, setFilterOptions] = useState(null);
  const searchRef = useRef(null);

  // Filter states
  const [filters, setFilters] = useState({
    location: { city: "", country: "" },
    industry: "",
    skills: [],
    category: "",
    mode: "",
    sortBy: "relevance",
  });

  const [totalCount, setTotalCount] = useState({
    people: 0,
    jobs: 0,
    services: 0,
  });

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Initial load from URL
  useEffect(() => {
    if (initialQuery && !hasSearched) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
        fetchSuggestions(query);
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters, activeTab]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/search/filters`);
      const data = await res.json();
      if (data.success) {
        setFilterOptions(data.data);
      }
    } catch (error) {
      console.error("Filter options error:", error);
    }
  };

  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) return;

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(
        `${API_URL}/api/search/suggestions?q=${encodeURIComponent(
          searchQuery
        )}&type=${activeTab}`
      );
      const data = await res.json();
      if (data.success) {
        setSuggestions(data.data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Suggestions error:", error);
    }
  };

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim() && !hasActiveFilters()) return;

    setLoading(true);
    setHasSearched(true);
    setShowSuggestions(false);

    // Build query params
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    params.set("type", activeTab);

    if (filters.location.city || filters.location.country) {
      params.set("location", JSON.stringify(filters.location));
    }
    if (filters.industry) params.set("industry", filters.industry);
    if (filters.skills.length > 0)
      params.set("skills", filters.skills.join(","));
    if (filters.category) params.set("category", filters.category);
    if (filters.mode) params.set("mode", filters.mode);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);

    router.push(`/dashboard/search?${params.toString()}`);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/search?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setResults(data.data);
        setTotalCount(
          data.data.totalCount || { people: 0, jobs: 0, services: 0 }
        );
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveFilters = () => {
    return (
      filters.location.city ||
      filters.location.country ||
      filters.industry ||
      filters.skills.length > 0 ||
      filters.category ||
      filters.mode
    );
  };

  const clearFilters = () => {
    setFilters({
      location: { city: "", country: "" },
      industry: "",
      skills: [],
      category: "",
      mode: "",
      sortBy: "relevance",
    });
  };

  const addSkill = (skill) => {
    if (!filters.skills.includes(skill)) {
      setFilters({ ...filters, skills: [...filters.skills, skill] });
    }
  };

  const removeSkill = (skill) => {
    setFilters({
      ...filters,
      skills: filters.skills.filter((s) => s !== skill),
    });
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "person" && suggestion.slug) {
      router.push(`/dashboard/profile/${suggestion.slug}`);
    } else {
      setQuery(suggestion.label);
      setShowSuggestions(false);
    }
  };

  const TabButton = ({ name, label, count }) => (
    <button
      onClick={() => {
        setActiveTab(name);
        if (query) handleSearch(query);
      }}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all relative ${
        activeTab === name
          ? "bg-primary text-primary-foreground shadow-md"
          : "bg-card text-muted-foreground hover:bg-muted border border-border"
      }`}
    >
      {label}
      {count > 0 && (
        <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-background/20">
          {count}
        </span>
      )}
    </button>
  );

  const SortButton = ({ value, label, icon: Icon }) => (
    <button
      onClick={() => setFilters({ ...filters, sortBy: value })}
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${
        filters.sortBy === value
          ? "bg-primary text-primary-foreground"
          : "bg-card border border-border hover:border-primary/50"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Search</h1>
          <p className="text-muted-foreground">
            Find people, jobs, and services across the platform
          </p>
        </div>

        {/* Search Bar with Suggestions */}
        <div ref={searchRef} className="relative max-w-3xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 z-10" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            placeholder="Search for jobs, people, services, skills..."
            className="w-full pl-12 pr-12 py-4 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm text-foreground"
            autoFocus
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setShowSuggestions(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions && (
            <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
              {suggestions.people?.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    People
                  </div>
                  {suggestions.people.map((person, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(person)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0">
                        {person.image && (
                          <Image
                            src={person.image}
                            width={32}
                            height={32}
                            alt={person.label}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">
                          {person.label}
                        </div>
                        {person.subtitle && (
                          <div className="text-xs text-muted-foreground truncate">
                            {person.subtitle}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {suggestions.skills?.length > 0 && (
                <div className="p-2 border-t border-border">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    Skills
                  </div>
                  {suggestions.skills.map((skill, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(skill)}
                      className="w-full px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left text-sm"
                    >
                      {skill.label}
                    </button>
                  ))}
                </div>
              )}

              {suggestions.locations?.length > 0 && (
                <div className="p-2 border-t border-border">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    Locations
                  </div>
                  {suggestions.locations.map((loc, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(loc)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left text-sm"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {loc.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tabs and Filter Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            <TabButton
              name="all"
              label="All"
              count={totalCount.people + totalCount.jobs + totalCount.services}
            />
            <TabButton name="people" label="People" count={totalCount.people} />
            <TabButton name="jobs" label="Jobs" count={totalCount.jobs} />
            <TabButton
              name="services"
              label="Services"
              count={totalCount.services}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              showFilters || hasActiveFilters()
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:border-primary/50"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters() && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-background/20">
                {
                  Object.values(filters).filter(
                    (v) =>
                      v &&
                      (Array.isArray(v)
                        ? v.length > 0
                        : typeof v === "object"
                        ? Object.values(v).some(Boolean)
                        : true)
                  ).length
                }
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && filterOptions && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Advanced Filters</h3>
              {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={filters.location.city}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      location: { ...filters.location, city: e.target.value },
                    })
                  }
                  placeholder="Enter city"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  list="cities"
                />
                <datalist id="cities">
                  {filterOptions.cities?.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={filters.location.country}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      location: {
                        ...filters.location,
                        country: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter country"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  list="countries"
                />
                <datalist id="countries">
                  {filterOptions.countries?.map((country) => (
                    <option key={country} value={country} />
                  ))}
                </datalist>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Industry
                </label>
                <select
                  value={filters.industry}
                  onChange={(e) =>
                    setFilters({ ...filters, industry: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">All Industries</option>
                  {filterOptions.industries?.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              {(activeTab === "services" || activeTab === "all") && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">All Categories</option>
                    {filterOptions.categories?.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Mode */}
              <div>
                <label className="block text-sm font-medium mb-2">Mode</label>
                <select
                  value={filters.mode}
                  onChange={(e) =>
                    setFilters({ ...filters, mode: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">All Modes</option>
                  {filterOptions.modes?.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Skills Multi-select */}
            <div>
              <label className="block text-sm font-medium mb-2">Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {filters.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:text-primary/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add skill..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                list="skills"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value) {
                    addSkill(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <datalist id="skills">
                {filterOptions.skills?.map((skill) => (
                  <option key={skill} value={skill} />
                ))}
              </datalist>
            </div>
          </div>
        )}

        {/* Sort Options */}
        {hasSearched && !loading && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <SortButton value="relevance" label="Relevance" icon={Sparkles} />
            <SortButton value="newest" label="Newest" icon={Clock} />
            <SortButton value="popular" label="Popular" icon={TrendingUp} />
            {activeTab === "jobs" && (
              <SortButton value="deadline" label="Deadline" icon={Star} />
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Searching...</p>
          </div>
        ) : !hasSearched ? (
          <div className="text-center text-muted-foreground py-20">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium mb-2">Start your search</p>
            <p className="text-sm">
              Enter keywords, skills, or locations to find what you're looking
              for
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* People Results */}
            {(activeTab === "all" || activeTab === "people") &&
              results.people?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-primary" />
                    People
                    <span className="text-sm text-muted-foreground font-normal">
                      ({totalCount.people}{" "}
                      {totalCount.people === 1 ? "result" : "results"})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.people.map((person) => (
                      <Link
                        href={`/dashboard/profile/${person.userId?.slug}`}
                        key={person._id}
                      >
                        <div className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg group h-full">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-border shrink-0">
                              <Image
                                src={
                                  person.profileImage ||
                                  "/assets/default-avatar.jpg"
                                }
                                width={56}
                                height={56}
                                alt={`${person.firstName} ${person.lastName}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold group-hover:text-primary transition-colors">
                                {person.firstName} {person.lastName}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {person.headline || "No headline"}
                              </p>
                              {person.industry && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  {person.industry}
                                </p>
                              )}
                              {(person.location?.city ||
                                person.location?.country) && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  {person.location?.city}
                                  {person.location?.city &&
                                    person.location?.country &&
                                    ", "}
                                  {person.location?.country}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

            {/* Jobs Results */}
            {(activeTab === "all" || activeTab === "jobs") &&
              results.jobs?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Jobs
                    <span className="text-sm text-muted-foreground font-normal">
                      ({totalCount.jobs}{" "}
                      {totalCount.jobs === 1 ? "result" : "results"})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {results.jobs.map((job) => (
                      <Link href={`/dashboard/jobs/${job._id}`} key={job._id}>
                        <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg group">
                          <div className="flex gap-4">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              {job.posterProfile?.profileImage ? (
                                <Image
                                  src={job.posterProfile.profileImage}
                                  width={56}
                                  height={56}
                                  alt="Company"
                                  className="w-full h-full object-cover rounded-xl"
                                />
                              ) : (
                                <Building2 className="w-7 h-7" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {job.title}
                              </h3>
                              {job.posterProfile && (
                                <p className="text-sm text-muted-foreground">
                                  {job.posterProfile.firstName}{" "}
                                  {job.posterProfile.lastName}
                                  {job.industry && ` • ${job.industry}`}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {job.description}
                              </p>

                              <div className="flex flex-wrap gap-2 mt-3">
                                {job.mode?.map((m) => (
                                  <span
                                    key={m}
                                    className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
                                  >
                                    {m.charAt(0).toUpperCase() + m.slice(1)}
                                  </span>
                                ))}
                                {job.skillsRequired
                                  ?.slice(0, 3)
                                  .map((skill, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-muted rounded-md text-xs"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                {job.skillsRequired?.length > 3 && (
                                  <span className="px-2 py-1 bg-muted rounded-md text-xs">
                                    +{job.skillsRequired.length - 3} more
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                {(job.location?.city ||
                                  job.location?.country) && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {job.location?.city}
                                    {job.location?.city &&
                                      job.location?.country &&
                                      ", "}
                                    {job.location?.country}
                                  </div>
                                )}
                                <span>•</span>
                                <span>
                                  {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                                {job.views > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>{job.views} views</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

            {/* Services Results */}
            {(activeTab === "all" || activeTab === "services") &&
              results.services?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Services
                    <span className="text-sm text-muted-foreground font-normal">
                      ({totalCount.services}{" "}
                      {totalCount.services === 1 ? "result" : "results"})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.services.map((service) => (
                      <Link
                        href={`/dashboard/services/${service._id}`}
                        key={service._id}
                      >
                        <div className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg group h-full flex flex-col">
                          {service.media?.images?.[0] && (
                            <div className="w-full h-40 rounded-lg overflow-hidden mb-4">
                              <Image
                                src={service.media.images[0]}
                                width={400}
                                height={160}
                                alt={service.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                              {service.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {service.category}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {service.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-3">
                              {service.modesAvailable?.map((mode) => (
                                <span
                                  key={mode}
                                  className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
                                >
                                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                </span>
                              ))}
                            </div>

                            {service.providerProfile && (
                              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
                                  <Image
                                    src={
                                      service.providerProfile.profileImage ||
                                      "/assets/default-avatar.jpg"
                                    }
                                    width={32}
                                    height={32}
                                    alt={service.providerProfile.firstName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="text-sm">
                                  <p className="font-medium">
                                    {service.providerProfile.firstName}{" "}
                                    {service.providerProfile.lastName}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

            {/* No Results State */}
            {results.people?.length === 0 &&
              results.jobs?.length === 0 &&
              results.services?.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No results found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    No results found for "{query}"
                    {hasActiveFilters() && " with the selected filters"}
                  </p>
                  {hasActiveFilters() && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Clear filters and try again
                    </button>
                  )}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

// Wrap the main content in Suspense

const SearchPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage;
