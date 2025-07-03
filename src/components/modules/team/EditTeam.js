

"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { FiUsers, FiX, FiHash, FiFolder, FiUser } from "react-icons/fi";
import { updateTeam } from "@/store/features/teamMembersSlice";
import { toast } from '@/components/ui/sonner';
const EditTeam = ({
  selectedTeam,
  setShowEditTeam,
  setShowTeamDetails,
  setSelectedTeam,
  members,
  membersStatus,
}) => {
  const dispatch = useDispatch();
  const [editFormData, setEditFormData] = useState({
    projectId: selectedTeam.projectId,
    projectName: selectedTeam.projectName,
    teamLeadId: selectedTeam.teamLeadId,
    teamLeadName: selectedTeam.teamLeadName,
    teamMembers: selectedTeam.teamMembers,
  });
  const [selectedMembers, setSelectedMembers] = useState(
    selectedTeam.teamMembers.map((member) => ({
      value: member.memberId,
      label: member.memberName,
      email: member.email,
    }))
  );
  const [memberRoles, setMemberRoles] = useState(
    selectedTeam.teamMembers.reduce(
      (acc, member) => ({
        ...acc,
        [member.memberId]: { value: member.role, label: member.role },
      }),
      {}
    )
  );

  const memberOptions =
    members?.map((member) => ({
      value: member.employeeID,
      label: member.name || `${member.firstName} ${member.lastName}`.trim(),
      email: member.email,
    })) || [];

  const roleOptions = [
    { value: "Frontend Developer", label: "Frontend Developer" },
    { value: "Backend Developer", label: "Backend Developer" },
    { value: "DevOps Engineer", label: "DevOps Engineer" },
    { value: "Full Stack Developer", label: "Full Stack Developer" },
    { value: "UI/UX Designer", label: "UI/UX Designer" },
    { value: "QA Engineer", label: "QA Engineer" },
  ];

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#E5E7EB",
      borderRadius: "0.5rem",
      padding: "0.25rem",
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      "&:hover": { borderColor: "#3B82F6" },
      boxShadow: "none",
      backgroundColor: "#FFFFFF",
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: "0.25rem",
      borderRadius: "0.5rem",
      border: "1px solid #E5E7EB",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      zIndex: 20,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#EFF6FF"
        : state.isFocused
        ? "#F9FAFB"
        : "#FFFFFF",
      color: "#1F2937",
      padding: "0.5rem 1rem",
      fontSize: "0.875rem",
      "&:hover": { backgroundColor: "#F3F4F6" },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9CA3AF",
      fontSize: "0.875rem",
    }),
    input: (base) => ({
      ...base,
      color: "#1F2937",
      fontSize: "0.875rem",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#EFF6FF",
      borderRadius: "0.375rem",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#1F2937",
      fontSize: "0.875rem",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#6B7280",
      "&:hover": { backgroundColor: "#BFDBFE", color: "#1F2937" },
    }),
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedMembers.length === 0) {
        throw new Error("Please select at least one team member");
      }

      const missingRoles = selectedMembers.filter(
        (member) => !memberRoles[member.value]
      );
      if (missingRoles.length > 0) {
        throw new Error(
          `Please select roles for: ${missingRoles
            .map((m) => m.label)
            .join(", ")}`
        );
      }

      const formattedTeamMembers = selectedMembers.map((member) => ({
        memberId: member.value,
        memberName: member.label,
        role: memberRoles[member.value]?.value,
        email: member.email,
      }));

      const teamData = {
        projectId: editFormData.projectId,
        projectName: editFormData.projectName,
        teamLeadId: editFormData.teamLeadId,
        teamLeadName: editFormData.teamLeadName,
        teamMembers: formattedTeamMembers,
      };

      const result = await dispatch(
        updateTeam({ teamId: selectedTeam.teamId, teamData })
      ).unwrap();
      if (result) {
        toast.success("Team updated successfully!");
        setShowEditTeam(false);
        setShowTeamDetails(true);
        setSelectedTeam({
          ...selectedTeam,
          ...teamData,
          teamMembers: formattedTeamMembers,
        });
      }
    } catch (err) {
      toast.error(`Failed to update team: ${err.message || "Unknown error"}`);
    }
  };

  const removeTeamMember = (memberToRemove) => {
    setSelectedMembers(
      selectedMembers.filter((member) => member.value !== memberToRemove.value)
    );
    const updatedRoles = { ...memberRoles };
    delete updatedRoles[memberToRemove.value];
    setMemberRoles(updatedRoles);
  };

  const handleRoleChange = (memberId, selectedRole) => {
    setMemberRoles((prev) => ({
      ...prev,
      [memberId]: selectedRole,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">
              Edit Team
            </h3>
            <button
              onClick={() => setShowEditTeam(false)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <FiX className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleEditSubmit} className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column: Project Details and Team Members Selection */}
            <div className="space-y-4 sm:space-y-6">
              {/* Team Members Selection */}
              <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                  <FiUsers className="h-4 w-4 text-blue-600" /> Select Team
                  Members
                </label>
                <Select
                  isMulti
                  value={selectedMembers}
                  onChange={(selected) => {
                    const updatedSelected = selected ?? [];
                    setSelectedMembers(updatedSelected);
                    const newRoles = { ...memberRoles };
                    Object.keys(newRoles).forEach((key) => {
                      if (!updatedSelected.some((s) => s.value === key)) {
                        delete newRoles[key];
                      }
                    });
                    setMemberRoles(newRoles);
                  }}
                  options={memberOptions}
                  getOptionLabel={(e) => e.label}
                  getOptionValue={(e) => e.value}
                  isLoading={membersStatus === "loading"}
                  className="react-select"
                  classNamePrefix="react-select"
                  placeholder={
                    membersStatus === "loading"
                      ? "Loading team members..."
                      : "Select team members"
                  }
                  noOptionsMessage={() =>
                    memberOptions.length === 0
                      ? "No team members available"
                      : "No results found"
                  }
                  isSearchable
                  isClearable
                  styles={customSelectStyles}
                />
              </div>
              {/* Project Details */}
              <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <FiHash className="h-4 w-4 text-gray-400" /> Project ID
                    </label>
                    <input
                      type="text"
                      name="projectId"
                      value={editFormData.projectId}
                      onChange={handleEditChange}
                      className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base text-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <FiFolder className="h-4 w-4 text-gray-400" /> Project
                      Name
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      value={editFormData.projectName}
                      onChange={handleEditChange}
                      className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base text-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <FiUser className="h-4 w-4 text-gray-400" /> Team Lead ID
                    </label>
                    <input
                      type="text"
                      name="teamLeadId"
                      value={editFormData.teamLeadId}
                      onChange={handleEditChange}
                      className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base text-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <FiUser className="h-4 w-4 text-gray-400" /> Team Lead
                      Name
                    </label>
                    <input
                      type="text"
                      name="teamLeadName"
                      value={editFormData.teamLeadName}
                      onChange={handleEditChange}
                      className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base text-gray-700"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Selected Members */}
            <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
                <FiUsers className="h-4 w-4 text-blue-600" /> Selected Team
                Members
              </h3>
              {selectedMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                  <FiUsers className="h-8 w-8 mb-2 text-gray-400" />
                  <p className="text-sm font-medium">
                    No team members selected yet
                  </p>
                  <p className="text-xs">Select team members from the left</p>
                </div>
              ) : (
                <div className="space-y-3 h-full overflow-y-auto pr-2">
                  {selectedMembers.map((member) => (
                    <div
                      key={member.value}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-200 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {member.label}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* <Select
                          value={memberRoles[member.value]}
                          onChange={(role) => handleRoleChange(member.value, role)}
                          options={roleOptions}
                          placeholder="Select Role"
                          styles={{
                            ...customSelectStyles,
                            control: (base) => ({
                              ...customSelectStyles.control(base),
                              minWidth: "120px",
                              maxWidth: "150px",
                            }),
                          }}
                          className="text-sm z-50"
                        /> */}
                        <Select
                          value={memberRoles[member.value]}
                          onChange={(role) =>
                            handleRoleChange(member.value, role)
                          }
                          options={roleOptions}
                          placeholder="Select Role"
                          styles={{
                            ...customSelectStyles,
                            control: (base) => ({
                              ...customSelectStyles.control(base),
                              minWidth: "120px",
                              maxWidth: "150px",
                            }),
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999, // Force it on top of all layers
                            }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                          }}
                          className="text-sm"
                          menuPortalTarget={document.body} // Important for detaching the menu from its container
                        />

                        <button
                          type="button"
                          onClick={() => removeTeamMember(member)}
                          className="p-1.5 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                        >
                          <FiX className="h-4 w-4 text-gray-400 group-hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4 sm:mt-6">
            <button
              type="button"
              onClick={() => setShowEditTeam(false)}
              className="px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm sm:text-base transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base shadow-sm transition-all cursor-pointer"
            >
              Update Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeam;
