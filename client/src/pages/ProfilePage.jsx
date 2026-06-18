import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authService } from "../services/authService";

import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";

export const ProfilePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const user = await authService.getMe();

      setFormData({
        name: user?.name || "",
        email: user?.email || "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load profile",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      await authService.updateProfile(formData);

      window.dispatchEvent(new Event("auth-change"));

      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setError('Type "DELETE" to confirm account deletion.');
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await authService.deleteAccount();

      window.dispatchEvent(new Event("auth-change"));

      navigate("/register", {
        replace: true,
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete account",
      );
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>Manage your MatchPulse account details.</p>
        </div>
      </div>

      {loading && <LoadingState message="Loading profile..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchProfile} />
      )}

      {!loading && (
        <div className="profile-layout">
          <section className="profile-card">
            <h2>Account Information</h2>

            {successMessage && (
              <div className="profile-success">{successMessage}</div>
            )}

            <form className="profile-form" onSubmit={handleSubmit}>
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Enter your name"
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="Enter your email"
                  onChange={handleChange}
                  required
                />
              </label>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </section>

          <section className="profile-card danger-card">
            <h2>Delete Account</h2>

            <p>
              This will permanently delete your account and your saved
              favorites. This action cannot be undone.
            </p>

            <label className="delete-confirm-label">
              Type DELETE to confirm
              <input
                type="text"
                value={deleteConfirmText}
                placeholder="DELETE"
                onChange={(event) => setDeleteConfirmText(event.target.value)}
              />
            </label>

            <button
              type="button"
              className="danger-button"
              disabled={deleting || deleteConfirmText !== "DELETE"}
              onClick={handleDeleteAccount}
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </section>
        </div>
      )}
    </section>
  );
};
