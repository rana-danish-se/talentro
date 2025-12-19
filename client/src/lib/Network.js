import { useState, useCallback } from "react";
import apiClient from "@/api/apiClient";
import { toast } from "react-toastify";

// --- API Functions ---

export const getSuggestionsApi = async () => {
  const response = await apiClient.get("/api/network/suggestions");
  return response.data;
};

export const getInvitationsApi = async () => {
  const response = await apiClient.get("/api/network/invitations");
  return response.data;
};

export const getTotalConnectionsApi = async () => {
  const response = await apiClient.get("/api/network/total-connections");
  return response.data;
};

export const sendInvitationApi = async (userId) => {
  const response = await apiClient.post("/api/network/send-invitation", {
    recipientId: userId,
  });
  return response.data;
};

export const acceptInvitationApi = async (connectionId) => {
  const response = await apiClient.put("/api/network/accept-invitation", {
    connectionId,
  });
  return response.data;
};

export const declineInvitationApi = async (connectionId) => {
  const response = await apiClient.put("/api/network/decline-invitation", {
    connectionId,
  });
  return response.data;
};

export const getConnectionsApi = async () => {
  const response = await apiClient.get("/api/network/connections");
  return response.data;
};

export const removeConnectionApi = async (connectionId) => {
  const response = await apiClient.post("/api/network/remove-connection", {
    connectionId,
  });
  return response.data;
};

export const getSentInvitationsApi = async () => {
  const response = await apiClient.get("/api/network/sent-invitations");
  return response.data;
};

// --- Custom Hook ---

export const useNetwork = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [connections, setConnections] = useState([]); // New State
  const [totalConnections, setTotalConnections] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSuggestionsApi();
      setSuggestions(data.suggestions);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setError(err.response?.data?.message || "Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInvitations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInvitationsApi();
      console.log(data);
      setInvitations(data);
    } catch (err) {
      console.error("Error fetching invitations:", err);
      setError(err.response?.data?.message || "Failed to fetch invitations");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchConnections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getConnectionsApi();
      setConnections(data);
    } catch (err) {
      console.error("Error fetching connections:", err);
      setError(err.response?.data?.message || "Failed to fetch connections");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSentInvitations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSentInvitationsApi();
      setSentInvitations(data);
    } catch (err) {
      console.error("Error fetching sent invitations:", err);
      setError(
        err.response?.data?.message || "Failed to fetch sent invitations"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTotalConnections = useCallback(async () => {
    try {
      const data = await getTotalConnectionsApi();
      setTotalConnections(data.totalConnections);
    } catch (err) {
      console.error("Error fetching total connections:", err);
    }
  }, []);

  const sendInvitation = useCallback(async (userId) => {
    try {
      const data = await sendInvitationApi(userId);
      toast.success("Invitation sent successfully!");
      // Optimistically remove from suggestions
      setSuggestions((prev) => prev.filter((user) => user._id !== userId));
      return data;
    } catch (err) {
      console.error("Error sending invitation:", err);
      const msg = err.response?.data?.message || "Failed to send invitation";
      toast.error(msg);
      throw err;
    }
  }, []);

  const acceptInvitation = useCallback(async (connectionId) => {
    try {
      const data = await acceptInvitationApi(connectionId);
      toast.success("Invitation accepted!");
      // Remove from invitations list
      setInvitations((prev) => prev.filter((inv) => inv._id !== connectionId));
      // Update total connections
      setTotalConnections((prev) => prev + 1);
      return data;
    } catch (err) {
      console.error("Error accepting invitation:", err);
      const msg = err.response?.data?.message || "Failed to accept invitation";
      toast.error(msg);
      throw err;
    }
  }, []);

  const declineInvitation = useCallback(async (connectionId) => {
    try {
      const data = await declineInvitationApi(connectionId);
      toast.info("Invitation declined");
      // Remove from invitations list
      setInvitations((prev) => prev.filter((inv) => inv._id !== connectionId));
      return data;
    } catch (err) {
      console.error("Error declining invitation:", err);
      const msg = err.response?.data?.message || "Failed to decline invitation";
      toast.error(msg);
      throw err;
    }
  }, []);

  const removeConnection = useCallback(async (connectionId) => {
    try {
      const data = await removeConnectionApi(connectionId);
      toast.info("Connection removed");
      // Update state
      setConnections((prev) =>
        prev.filter((conn) => conn._id !== connectionId)
      );
      setTotalConnections((prev) => Math.max(0, prev - 1));
      return data;
    } catch (err) {
      console.error("Error removing connection:", err);
      const msg = err.response?.data?.message || "Failed to remove connection";
      toast.error(msg);
      throw err;
    }
  }, []);

  return {
    suggestions,
    invitations,
    sentInvitations,
    connections, // Exported
    totalConnections,
    loading,
    error,
    fetchSuggestions,
    fetchInvitations,
    fetchSentInvitations,
    fetchConnections, // Exported
    fetchTotalConnections,
    sendInvitation,
    acceptInvitation,
    declineInvitation,
    removeConnection,
  };
};
