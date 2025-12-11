import axios from "axios";

/**
 * OneSignal Service for Push Notifications
 * Handles all interactions with OneSignal API
 */

class OneSignalService {
  constructor() {
    this.appId = process.env.ONESIGNAL_APP_ID;
    this.apiKey = process.env.ONESIGNAL_API_KEY;
    this.baseUrl = "https://onesignal.com/api/v1";
  }

  /**
   * Send a push notification to a specific user
   * @param {string} userId - The user ID (external user ID in OneSignal)
   * @param {Object} payload - Notification payload
   * @returns {Promise<Object>} OneSignal response
   */
  async sendNotificationToUser(userId, payload) {
    try {
      if (!this.appId || !this.apiKey) {
        console.warn(
          "OneSignal credentials not configured. Skipping push notification."
        );
        return { skipped: true, reason: "credentials_missing" };
      }

      const response = await axios.post(
        `${this.baseUrl}/notifications`,
        {
          app_id: this.appId,
          include_external_user_ids: [userId.toString()],
          ...payload,
        },
        {
          headers: {
            Authorization: `Basic ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "OneSignal API error:",
        error.response?.data || error.message
      );
      throw new Error(`Failed to send push notification: ${error.message}`);
    }
  }

  /**
   * Send notifications to multiple users
   * @param {Array<string>} userIds - Array of user IDs
   * @param {Object} payload - Notification payload
   * @returns {Promise<Object>} OneSignal response
   */
  async sendNotificationToUsers(userIds, payload) {
    try {
      if (!this.appId || !this.apiKey) {
        console.warn(
          "OneSignal credentials not configured. Skipping push notification."
        );
        return { skipped: true, reason: "credentials_missing" };
      }

      const response = await axios.post(
        `${this.baseUrl}/notifications`,
        {
          app_id: this.appId,
          include_external_user_ids: userIds.map((id) => id.toString()),
          ...payload,
        },
        {
          headers: {
            Authorization: `Basic ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "OneSignal API error:",
        error.response?.data || error.message
      );
      throw new Error(`Failed to send push notification: ${error.message}`);
    }
  }

  /**
   * Get notification delivery status
   * @param {string} notificationId - OneSignal notification ID
   * @returns {Promise<Object>} Notification status
   */
  async getNotificationStatus(notificationId) {
    try {
      if (!this.appId || !this.apiKey) {
        throw new Error("OneSignal credentials not configured");
      }

      const response = await axios.get(
        `${this.baseUrl}/notifications/${notificationId}?app_id=${this.appId}`,
        {
          headers: {
            Authorization: `Basic ${this.apiKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "OneSignal status check error:",
        error.response?.data || error.message
      );
      throw new Error(`Failed to get notification status: ${error.message}`);
    }
  }

  /**
   * Cancel a scheduled notification
   * @param {string} notificationId - OneSignal notification ID
   * @returns {Promise<Object>} Cancellation response
   */
  async cancelNotification(notificationId) {
    try {
      if (!this.appId || !this.apiKey) {
        throw new Error("OneSignal credentials not configured");
      }

      const response = await axios.delete(
        `${this.baseUrl}/notifications/${notificationId}?app_id=${this.appId}`,
        {
          headers: {
            Authorization: `Basic ${this.apiKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "OneSignal cancel error:",
        error.response?.data || error.message
      );
      throw new Error(`Failed to cancel notification: ${error.message}`);
    }
  }
}

export default new OneSignalService();
