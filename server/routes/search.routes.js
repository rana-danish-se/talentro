import express from "express";
import { 
  search, 
  searchSuggestions, 
  getFilterOptions 
} from "../controllers/search.controller.js";

const router = express.Router();

// Main search endpoint
router.get("/", search);

// Autocomplete/suggestions endpoint
router.get("/suggestions", searchSuggestions);

// Get available filter options
router.get("/filters", getFilterOptions);

export default router;