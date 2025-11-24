import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";
import ImagePreview from "../components/ImagePreview";

const Admin = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    onConfirm: null,
    title: "",
    message: "",
  });
  const [stagedImages, setStagedImages] = useState({
    profile: null, // { file: File, preview: string, oldUrl: string }
    achievements: {}, // { achievementId: { file, preview } }
    projects: {}, // { imageId: { file, preview, projectIndex } }
  });
  const navigate = useNavigate();

  // Helper function to get full URL for assets
  const getAssetUrl = (url) => {
    if (!url) return "https://via.placeholder.com/150";

    // If it's already a full URL, return as is
    if (url.startsWith("http")) {
      return url;
    }

    // If it's a relative path, the proxy will handle it
    return url;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/portfolio");
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          // Token expired or invalid
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          navigate("/login");
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const handleChange = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upload all staged images first
      const uploadPromises = [];

      // Upload profile image if staged
      if (stagedImages.profile) {
        uploadPromises.push(
          handleFileUpload(stagedImages.profile.file).then(async (url) => {
            // Delete old image from Cloudinary
            if (
              stagedImages.profile.oldUrl &&
              stagedImages.profile.oldUrl.startsWith("http")
            ) {
              await deleteCloudinaryImage(stagedImages.profile.oldUrl);
            }
            return { type: "profile", url };
          })
        );
      }

      // Upload achievement images if staged
      Object.entries(stagedImages.achievements).forEach(([id, imageData]) => {
        if (imageData.file) {
          uploadPromises.push(
            handleFileUpload(imageData.file).then(async (url) => {
              if (imageData.oldUrl && imageData.oldUrl.startsWith("http")) {
                await deleteCloudinaryImage(imageData.oldUrl);
              }
              return { type: "achievement", id, url };
            })
          );
        }
      });

      // Upload project images if staged
      Object.entries(stagedImages.projects).forEach(([imageId, imageData]) => {
        if (imageData.file) {
          uploadPromises.push(
            handleFileUpload(imageData.file).then((url) => {
              return {
                type: "project",
                projectIndex: imageData.projectIndex,
                preview: imageData.preview,
                url,
              };
            })
          );
        }
      });

      // Wait for all uploads
      const uploadResults = await Promise.all(uploadPromises);

      // Update data with new URLs
      const updatedData = { ...data };
      uploadResults.forEach(({ type, url, id, projectIndex, preview }) => {
        if (type === "profile") {
          updatedData.profile.avatar = url;
        } else if (type === "achievement") {
          const achievement = updatedData.achievements.find((a) => a.id === id);
          if (achievement) {
            achievement.image = url;
          }
        } else if (type === "project") {
          // Replace blob preview URL with real Cloudinary URL
          const project = updatedData.projects[projectIndex];
          if (project && project.images) {
            const blobIndex = project.images.findIndex(
              (img) => img === preview
            );
            if (blobIndex !== -1) {
              project.images[blobIndex] = url;
            }
          }
        }
      });

      // Save to GitHub
      await axios.post("/api/portfolio", updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Update local state
      setData(updatedData);

      // Clear staged images
      setStagedImages({
        profile: null,
        achievements: {},
        projects: {},
      });

      toast.success("Saved successfully!", {
        duration: 3000,
        icon: "✅",
      });
    } catch (err) {
      console.error("Save failed:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        handleLogout();
      } else {
        toast.error("Error saving data");
      }
    } finally {
      setSaving(false);
    }
  };

  // Upload file to Cloudinary (returns promise)
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data.url;
  };

  // Delete image from Cloudinary
  const deleteCloudinaryImage = async (url) => {
    try {
      await axios.delete("/api/upload", {
        data: { url },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (err) {
      console.error("Failed to delete image:", err);
      // Don't throw error, just log it
    }
  };

  // Stage image for upload (preview only)
  const stageProfileImage = (file) => {
    const preview = URL.createObjectURL(file);
    setStagedImages((prev) => ({
      ...prev,
      profile: {
        file,
        preview,
        oldUrl: data.profile.avatar,
      },
    }));
    // Update data with preview URL for immediate display
    handleChange("profile", "avatar", preview);
  };

  // Remove staged profile image
  const removeStagedProfileImage = () => {
    if (stagedImages.profile) {
      URL.revokeObjectURL(stagedImages.profile.preview);
      setStagedImages((prev) => ({
        ...prev,
        profile: null,
      }));
      // Restore old URL
      handleChange("profile", "avatar", stagedImages.profile.oldUrl);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid #38bdf8",
          },
          success: {
            iconTheme: {
              primary: "#38bdf8",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-secondary p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg bg-primary hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">Manage your portfolio</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {saving ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="hidden sm:inline">Save</span>
                </>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar Navigation - Mobile & Desktop */}
        <div
          className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-secondary transform transition-transform duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        >
          <div className="h-full flex flex-col">
            {/* Mobile Sidebar Header */}
            <div className="lg:hidden p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-accent">Menu</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded hover:bg-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="bg-secondary rounded-xl p-4 mb-6">
                <h3 className="font-bold text-lg mb-4 text-accent">
                  Navigation
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    { id: "profile", label: "Profile", icon: "👤" },
                    { id: "skills", label: "Skills", icon: "💡" },
                    { id: "experience", label: "Experience", icon: "💼" },
                    { id: "projects", label: "Projects", icon: "🚀" },
                    { id: "achievements", label: "Achievements", icon: "🏆" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`text-left px-4 py-3 rounded-lg transition-all flex items-center ${
                        activeTab === tab.id
                          ? "bg-accent text-primary font-bold shadow-lg"
                          : "bg-primary hover:bg-gray-700"
                      }`}
                    >
                      <span className="mr-3 text-lg">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-secondary rounded-xl p-4">
                <h3 className="font-bold text-lg mb-4 text-accent">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Skills:</span>
                    <span className="font-bold">
                      {data?.skills
                        ? Object.values(data.skills).flat().length
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Experience:</span>
                    <span className="font-bold">
                      {data?.experience?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Projects:</span>
                    <span className="font-bold">
                      {data?.projects?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-screen">
          {/* Desktop Header */}
          <div className="hidden lg:block bg-primary p-8 pb-0">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                  <p className="text-gray-400 mt-2">
                    Manage your portfolio content
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <div className="bg-secondary p-4 lg:p-6 rounded-xl">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6 text-accent">
                      Profile Information
                    </h2>

                    {/* Profile Image Upload */}
                    <div className="bg-primary p-4 lg:p-6 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-bold mb-4">Profile Image</h3>
                      <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
                        <img
                          src={getAssetUrl(data.profile.avatar)}
                          alt="Profile"
                          className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover border-2 border-accent shadow-lg"
                        />
                        <div className="flex-1 w-full">
                          <label className="block text-sm text-gray-400 mb-2">
                            Upload New Image
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              stageProfileImage(file);
                              e.target.value = ""; // Reset input
                            }}
                            className="w-full text-sm text-gray-400 file:mr-2 file:py-2 file:px-3 lg:file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:bg-opacity-90"
                          />
                          {stagedImages.profile && (
                            <p className="text-yellow-500 text-sm mt-2 flex items-center gap-2">
                              <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                              Image staged - click Save to upload
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Recommended: Square image, 400x400px or larger
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profile Fields */}
                    <div className="bg-primary p-4 lg:p-6 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-bold mb-4">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(data.profile)
                          .filter(
                            (key) => key !== "avatar" && key !== "summary"
                          )
                          .map((key) => (
                            <div key={key} className="space-y-2">
                              <label className="block text-sm font-medium text-gray-400 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </label>
                              <input
                                type="text"
                                value={data.profile[key]}
                                onChange={(e) =>
                                  handleChange("profile", key, e.target.value)
                                }
                                className="w-full p-3 rounded bg-secondary border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
                                placeholder={`Enter ${key
                                  .replace(/([A-Z])/g, " $1")
                                  .toLowerCase()}`}
                              />
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-primary p-4 lg:p-6 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-bold mb-4">
                        Professional Summary
                      </h3>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">
                          Summary
                        </label>
                        <textarea
                          value={data.profile.summary}
                          onChange={(e) =>
                            handleChange("profile", "summary", e.target.value)
                          }
                          className="w-full p-3 rounded bg-secondary border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none h-32 resize-none transition-colors"
                          placeholder="Write a compelling professional summary..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === "skills" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6 text-accent">
                      Skills & Technologies
                    </h2>

                    {Object.entries(data.skills).map(([category, skills]) => (
                      <div
                        key={category}
                        className="bg-primary p-4 lg:p-6 rounded-lg border border-gray-700"
                      >
                        <h3 className="text-lg font-bold text-accent mb-4 capitalize">
                          {category} Skills
                        </h3>

                        {/* Current Skills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {skills.map((skill, index) => (
                            <div
                              key={index}
                              className="bg-secondary px-3 py-1 lg:px-4 lg:py-2 rounded-full flex items-center gap-2 border border-gray-600 hover:border-accent transition-colors"
                            >
                              <span className="text-sm">{skill}</span>
                              <button
                                onClick={() => {
                                  const newSkills = skills.filter(
                                    (_, i) => i !== index
                                  );
                                  setData((prev) => ({
                                    ...prev,
                                    skills: {
                                      ...prev.skills,
                                      [category]: newSkills,
                                    },
                                  }));
                                }}
                                className="text-red-400 hover:text-red-300 transition-colors text-lg leading-none"
                                title="Remove skill"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                          {skills.length === 0 && (
                            <p className="text-gray-500 text-sm">
                              No skills added yet
                            </p>
                          )}
                        </div>

                        {/* Add New Skill */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            id={`newSkill-${category}`}
                            placeholder={`Add new ${category} skill...`}
                            className="flex-1 p-3 rounded bg-secondary border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const val = e.target.value.trim();
                                if (val) {
                                  setData((prev) => ({
                                    ...prev,
                                    skills: {
                                      ...prev.skills,
                                      [category]: [
                                        ...prev.skills[category],
                                        val,
                                      ],
                                    },
                                  }));
                                  e.target.value = "";
                                }
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById(
                                `newSkill-${category}`
                              );
                              const val = input.value.trim();
                              if (val) {
                                setData((prev) => ({
                                  ...prev,
                                  skills: {
                                    ...prev.skills,
                                    [category]: [...prev.skills[category], val],
                                  },
                                }));
                                input.value = "";
                              }
                            }}
                            className="px-4 py-3 lg:px-6 bg-accent text-primary font-bold rounded hover:bg-opacity-90 transition-colors whitespace-nowrap"
                          >
                            Add Skill
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === "experience" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <h2 className="text-2xl font-bold text-accent">
                        Work Experience
                      </h2>
                      <button
                        onClick={() => {
                          const newExperience = {
                            role: "",
                            company: "",
                            location: "",
                            period: "",
                            description: "",
                          };
                          setData((prev) => ({
                            ...prev,
                            experience: [...prev.experience, newExperience],
                          }));
                        }}
                        className="px-4 py-2 lg:px-6 lg:py-3 bg-accent text-primary font-bold rounded hover:bg-opacity-90 transition-colors flex items-center gap-2 whitespace-nowrap"
                      >
                        <span>+</span> Add New Experience
                      </button>
                    </div>

                    <div className="space-y-4 lg:space-y-6">
                      {data.experience.map((item, index) => (
                        <div
                          key={index}
                          className="bg-primary p-4 lg:p-6 rounded-lg border border-gray-700 relative group"
                        >
                          <button
                            onClick={() => {
                              const newList = data.experience.filter(
                                (_, i) => i !== index
                              );
                              setData((prev) => ({
                                ...prev,
                                experience: newList,
                              }));
                            }}
                            className="absolute top-3 right-3 lg:top-4 lg:right-4 text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-red-500/20"
                            title="Delete experience"
                          >
                            <svg
                              className="w-4 h-4 lg:w-5 lg:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {["role", "company", "location", "period"].map(
                              (field) => (
                                <div key={field} className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-400 capitalize">
                                    {field}
                                  </label>
                                  <input
                                    type="text"
                                    value={item[field]}
                                    onChange={(e) => {
                                      const newList = [...data.experience];
                                      newList[index][field] = e.target.value;
                                      setData((prev) => ({
                                        ...prev,
                                        experience: newList,
                                      }));
                                    }}
                                    className="w-full p-3 rounded bg-secondary border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
                                    placeholder={`Enter ${field}`}
                                  />
                                </div>
                              )
                            )}

                            <div className="md:col-span-2 space-y-2">
                              <label className="block text-sm font-medium text-gray-400">
                                Description
                              </label>
                              <textarea
                                value={item.description}
                                onChange={(e) => {
                                  const newList = [...data.experience];
                                  newList[index].description = e.target.value;
                                  setData((prev) => ({
                                    ...prev,
                                    experience: newList,
                                  }));
                                }}
                                className="w-full p-3 rounded bg-secondary border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none h-32 resize-none transition-colors"
                                placeholder="Describe your responsibilities and achievements..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects Tab */}
                {activeTab === "projects" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <h2 className="text-2xl font-bold text-accent">
                        Projects
                      </h2>
                      <button
                        onClick={() => {
                          const newProject = {
                            name: "",
                            technologies: "",
                            description: "",
                            period: "",
                            images: [],
                            demoUrl: "",
                            githubUrl: "",
                          };
                          setData((prev) => ({
                            ...prev,
                            projects: [...prev.projects, newProject],
                          }));
                        }}
                        className="px-4 py-2 lg:px-6 lg:py-3 bg-accent text-primary font-bold rounded hover:bg-opacity-90 transition-colors flex items-center gap-2 whitespace-nowrap"
                      >
                        <span>+</span> Add New Project
                      </button>
                    </div>

                    <div className="space-y-4 lg:space-y-6">
                      {data.projects.map((project, index) => (
                        <div
                          key={index}
                          className="bg-primary p-4 lg:p-6 rounded-lg border border-gray-700 relative group"
                        >
                          <button
                            onClick={() => {
                              const newList = data.projects.filter(
                                (_, i) => i !== index
                              );
                              setData((prev) => ({
                                ...prev,
                                projects: newList,
                              }));
                            }}
                            className="absolute top-3 right-3 lg:top-4 lg:right-4 text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-red-500/20"
                            title="Delete project"
                          >
                            <svg
                              className="w-4 h-4 lg:w-5 lg:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              "name",
                              "technologies",
                              "period",
                              "demoUrl",
                              "githubUrl",
                            ].map((field) => (
                              <div
                                key={field}
                                className={
                                  field === "name" ? "md:col-span-2" : ""
                                }
                              >
                                <label className="block text-sm font-medium text-gray-400 capitalize mb-2">
                                  {field === "demoUrl"
                                    ? "Demo URL"
                                    : field === "githubUrl"
                                    ? "GitHub URL"
                                    : field}
                                </label>
                                <input
                                  type="text"
                                  value={project[field] || ""}
                                  onChange={(e) => {
                                    const newList = [...data.projects];
                                    newList[index][field] = e.target.value;
                                    setData((prev) => ({
                                      ...prev,
                                      projects: newList,
                                    }));
                                  }}
                                  className="w-full p-3 rounded bg-secondary border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
                                  placeholder={`Enter ${field}`}
                                />
                              </div>
                            ))}

                            <div className="md:col-span-2 space-y-2">
                              <label className="block text-sm font-medium text-gray-400">
                                Description
                              </label>
                              <textarea
                                value={project.description}
                                onChange={(e) => {
                                  const newList = [...data.projects];
                                  newList[index].description = e.target.value;
                                  setData((prev) => ({
                                    ...prev,
                                    projects: newList,
                                  }));
                                }}
                                className="w-full p-3 rounded bg-secondary border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none h-32 resize-none transition-colors"
                                placeholder="Describe your project..."
                              />
                            </div>

                            {/* Project Images */}
                            <div className="md:col-span-2 space-y-2">
                              <label className="block text-sm font-medium text-gray-400">
                                Project Images
                                <span className="text-xs text-gray-500 ml-2">
                                  (Use arrows to reorder)
                                </span>
                              </label>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {project.images &&
                                  project.images.map((img, imgIndex) => (
                                    <div
                                      key={imgIndex}
                                      className="relative group/image"
                                    >
                                      <img
                                        src={getAssetUrl(img)}
                                        alt={`Project ${index + 1}`}
                                        className="w-20 h-20 lg:w-32 lg:h-32 object-cover rounded border-2 border-gray-600 hover:border-accent transition-colors"
                                      />

                                      {/* Order badge */}
                                      <div className="absolute top-1 left-1 bg-primary/90 text-accent text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-accent/50">
                                        {imgIndex + 1}
                                      </div>

                                      {/* Move left button */}
                                      {imgIndex > 0 && (
                                        <button
                                          onClick={() => {
                                            const newList = [...data.projects];
                                            const images = [
                                              ...newList[index].images,
                                            ];
                                            // Swap with previous
                                            [
                                              images[imgIndex - 1],
                                              images[imgIndex],
                                            ] = [
                                              images[imgIndex],
                                              images[imgIndex - 1],
                                            ];
                                            newList[index].images = images;
                                            setData((prev) => ({
                                              ...prev,
                                              projects: newList,
                                            }));
                                            toast.success("Image moved left", {
                                              icon: "⬅️",
                                              duration: 1500,
                                            });
                                          }}
                                          className="absolute top-1/2 -translate-y-1/2 -left-1 lg:-left-2 bg-blue-500 text-white rounded-full w-6 h-6 lg:w-7 lg:h-7 flex items-center justify-center text-sm opacity-100 lg:opacity-0 lg:group-hover/image:opacity-100 transition-opacity hover:bg-blue-600 shadow-lg"
                                          title="Move left"
                                        >
                                          ←
                                        </button>
                                      )}

                                      {/* Move right button */}
                                      {imgIndex < project.images.length - 1 && (
                                        <button
                                          onClick={() => {
                                            const newList = [...data.projects];
                                            const images = [
                                              ...newList[index].images,
                                            ];
                                            // Swap with next
                                            [
                                              images[imgIndex],
                                              images[imgIndex + 1],
                                            ] = [
                                              images[imgIndex + 1],
                                              images[imgIndex],
                                            ];
                                            newList[index].images = images;
                                            setData((prev) => ({
                                              ...prev,
                                              projects: newList,
                                            }));
                                            toast.success("Image moved right", {
                                              icon: "➡️",
                                              duration: 1500,
                                            });
                                          }}
                                          className="absolute top-1/2 -translate-y-1/2 -right-1 lg:-right-2 bg-blue-500 text-white rounded-full w-6 h-6 lg:w-7 lg:h-7 flex items-center justify-center text-sm opacity-100 lg:opacity-0 lg:group-hover/image:opacity-100 transition-opacity hover:bg-blue-600 shadow-lg"
                                          title="Move right"
                                        >
                                          →
                                        </button>
                                      )}

                                      {/* Delete button */}
                                      <button
                                        onClick={() => {
                                          const newList = [...data.projects];
                                          newList[index].images = newList[
                                            index
                                          ].images.filter(
                                            (_, i) => i !== imgIndex
                                          );
                                          setData((prev) => ({
                                            ...prev,
                                            projects: newList,
                                          }));
                                          toast.success("Image removed", {
                                            icon: "🗑️",
                                            duration: 1500,
                                          });
                                        }}
                                        className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-red-500 text-white rounded-full w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center text-xs opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-red-600"
                                        title="Delete image"
                                      >
                                        &times;
                                      </button>
                                    </div>
                                  ))}
                              </div>

                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files);
                                  if (files.length === 0) return;

                                  // Stage the images for upload
                                  const newImages = [];
                                  files.forEach((file) => {
                                    const preview = URL.createObjectURL(file);
                                    const imageId = `project-${index}-img-${Date.now()}-${Math.random()}`;

                                    // Add to staged images
                                    setStagedImages((prev) => ({
                                      ...prev,
                                      projects: {
                                        ...prev.projects,
                                        [imageId]: {
                                          file,
                                          preview,
                                          projectIndex: index,
                                        },
                                      },
                                    }));

                                    newImages.push(preview);
                                  });

                                  // Update data with preview URLs
                                  const newList = [...data.projects];
                                  newList[index].images = [
                                    ...(newList[index].images || []),
                                    ...newImages,
                                  ];
                                  setData((prev) => ({
                                    ...prev,
                                    projects: newList,
                                  }));

                                  toast.success(
                                    `${files.length} image(s) staged - click Save to upload`,
                                    {
                                      icon: "📸",
                                    }
                                  );

                                  e.target.value = ""; // Reset input
                                }}
                                className="w-full text-sm text-gray-400 file:mr-2 file:py-2 file:px-3 lg:file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:bg-opacity-90"
                              />
                              <p className="text-xs text-gray-500">
                                You can select multiple images - they will be
                                uploaded when you click Save
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements Tab */}
                {activeTab === "achievements" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <h2 className="text-2xl font-bold text-accent">
                        Certifications & Awards
                      </h2>
                      <button
                        onClick={() => {
                          const newAchievement = {
                            id: `achievement-${Date.now()}`,
                            type: "certification",
                            name: "",
                            issuer: "",
                            date: new Date().toISOString().split("T")[0],
                            description: "",
                            image: null,
                          };
                          setData((prev) => ({
                            ...prev,
                            achievements: [
                              ...(prev.achievements || []),
                              newAchievement,
                            ],
                          }));
                        }}
                        className="px-4 py-2 lg:px-6 lg:py-3 bg-accent text-primary font-bold rounded hover:bg-opacity-90 transition-colors flex items-center gap-2 whitespace-nowrap"
                      >
                        <span>+</span> Add New Achievement
                      </button>
                    </div>

                    <div className="space-y-4 lg:space-y-6">
                      {(data.achievements || []).map((achievement, index) => (
                        <div
                          key={achievement.id}
                          className="bg-primary p-4 lg:p-6 rounded-lg border border-gray-700 relative group"
                        >
                          <button
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                title: "Delete Achievement?",
                                message: `Are you sure you want to delete "${achievement.name}"? This action cannot be undone.`,
                                onConfirm: async () => {
                                  // Delete image from Cloudinary if exists
                                  if (
                                    achievement.image &&
                                    achievement.image.startsWith("http")
                                  ) {
                                    await deleteCloudinaryImage(
                                      achievement.image
                                    );
                                  }
                                  const newList = data.achievements.filter(
                                    (_, i) => i !== index
                                  );
                                  setData((prev) => ({
                                    ...prev,
                                    achievements: newList,
                                  }));
                                },
                              });
                            }}
                            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete achievement"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-400">
                                Type
                              </label>
                              <select
                                value={achievement.type}
                                onChange={(e) => {
                                  const newList = [...data.achievements];
                                  newList[index].type = e.target.value;
                                  setData((prev) => ({
                                    ...prev,
                                    achievements: newList,
                                  }));
                                }}
                                className="w-full p-3 rounded bg-secondary border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
                              >
                                <option value="certification">
                                  Certification
                                </option>
                                <option value="award">Award</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-400">
                                Date Received
                              </label>
                              <input
                                type="date"
                                value={achievement.date}
                                onChange={(e) => {
                                  const newList = [...data.achievements];
                                  newList[index].date = e.target.value;
                                  setData((prev) => ({
                                    ...prev,
                                    achievements: newList,
                                  }));
                                }}
                                className="w-full p-3 rounded bg-secondary border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-400">
                                {achievement.type === "certification"
                                  ? "Certification"
                                  : "Award"}{" "}
                                Name
                              </label>
                              <input
                                type="text"
                                value={achievement.name}
                                onChange={(e) => {
                                  const newList = [...data.achievements];
                                  newList[index].name = e.target.value;
                                  setData((prev) => ({
                                    ...prev,
                                    achievements: newList,
                                  }));
                                }}
                                className="w-full p-3 rounded bg-secondary border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
                                placeholder="e.g., AWS Certified Solutions Architect"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-400">
                                Issued By / Organization
                              </label>
                              <input
                                type="text"
                                value={achievement.issuer}
                                onChange={(e) => {
                                  const newList = [...data.achievements];
                                  newList[index].issuer = e.target.value;
                                  setData((prev) => ({
                                    ...prev,
                                    achievements: newList,
                                  }));
                                }}
                                className="w-full p-3 rounded bg-secondary border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
                                placeholder="e.g., Amazon Web Services"
                              />
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <label className="block text-sm font-medium text-gray-400">
                              Description (Optional)
                            </label>
                            <textarea
                              value={achievement.description || ""}
                              onChange={(e) => {
                                const newList = [...data.achievements];
                                newList[index].description = e.target.value;
                                setData((prev) => ({
                                  ...prev,
                                  achievements: newList,
                                }));
                              }}
                              className="w-full p-3 rounded bg-secondary border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none h-24 resize-none transition-colors"
                              placeholder="Brief description of the achievement..."
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">
                              Certificate/Award Image (Optional)
                            </label>
                            <div className="flex items-center gap-4">
                              {achievement.image && (
                                <ImagePreview
                                  src={getAssetUrl(achievement.image)}
                                  onRemove={() => {
                                    const newList = [...data.achievements];
                                    newList[index].image = null;
                                    setData((prev) => ({
                                      ...prev,
                                      achievements: newList,
                                    }));
                                    // Remove from staged images
                                    setStagedImages((prev) => {
                                      const newStaged = { ...prev };
                                      delete newStaged.achievements[
                                        achievement.id
                                      ];
                                      return newStaged;
                                    });
                                  }}
                                  isStaged={
                                    stagedImages.achievements[achievement.id]
                                      ?.file
                                  }
                                />
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;

                                  // Stage the image
                                  const preview = URL.createObjectURL(file);
                                  setStagedImages((prev) => ({
                                    ...prev,
                                    achievements: {
                                      ...prev.achievements,
                                      [achievement.id]: {
                                        file,
                                        preview,
                                        oldUrl: achievement.image,
                                      },
                                    },
                                  }));

                                  // Update data with preview
                                  const newList = [...data.achievements];
                                  newList[index].image = preview;
                                  setData((prev) => ({
                                    ...prev,
                                    achievements: newList,
                                  }));

                                  e.target.value = "";
                                }}
                                className="flex-1 text-sm text-gray-400 file:mr-2 file:py-2 file:px-3 lg:file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:bg-opacity-90"
                              />
                            </div>
                            {stagedImages.achievements[achievement.id] && (
                              <p className="text-yellow-500 text-sm flex items-center gap-2">
                                <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                                Image staged - click Save to upload
                              </p>
                            )}
                          </div>
                        </div>
                      ))}

                      {(!data.achievements ||
                        data.achievements.length === 0) && (
                        <div className="text-center py-12 text-gray-400">
                          <svg
                            className="w-16 h-16 mx-auto mb-4 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                          </svg>
                          <p>No achievements added yet</p>
                          <p className="text-sm mt-2">
                            Click "Add New Achievement" to get started
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
