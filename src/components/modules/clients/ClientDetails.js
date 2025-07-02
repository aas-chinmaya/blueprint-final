"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Briefcase,
  Users,
  List,
  Info,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  fetchClientById,
  fetchProjectsByClientId,
} from "@/store/features/clientSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Typography from "@/components/ui/typography";

const statusConfig = {
  Planned: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: <Clock className="w-4 h-4" />,
    gradient: "from-green-50 to-green-100",
  },
  "In Progress": {
    color: "bg-green-200 text-green-800 border-green-300",
    icon: <AlertCircle className="w-4 h-4" />,
    gradient: "from-green-100 to-green-200",
  },
  Completed: {
    color: "bg-green-300 text-green-900 border-green-400",
    icon: <CheckCircle className="w-4 h-4" />,
    gradient: "from-green-200 to-green-300",
  },
};

export default function ClientDetails() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const clientId = params.id;

  const {
    formData = {},
    fetchClientLoading: loading,
    fetchClientError: error,
    projects = [],
    fetchProjectsLoading: projectsLoading,
  } = useSelector((state) => state.client || {});

  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (clientId) {
      dispatch(fetchClientById(clientId));
      dispatch(fetchProjectsByClientId(clientId));
    }
  }, [clientId, dispatch]);

  const handleProjectClick = (projectId) => {
    router.push(`/project/${projectId}`);
  };

  const clientFields = [
    { key: "clientName", label: "Client Name", icon: User },
    { key: "industryType", label: "Industry", icon: Briefcase },
    { key: "contactEmail", label: "Email", icon: Mail },
    { key: "contactNo", label: "Phone", icon: Phone },
    { key: "contactPersonName", label: "Contact Person", icon: Users },
    { key: "onboardingDate", label: "Onboarding Date", icon: Calendar },
    { key: "address", label: "Address", icon: MapPin },
    { key: "website", label: "Website", icon: Globe },
  ];

  if (loading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center  w-full">
          <div className="w-16 h-16 mb-6 mx-auto border-4 border-green-200 rounded-full animate-spin border-t-green-600"></div>
          <Typography variant="h3" className="text-green-800 mb-2">
            Loading Client Details
          </Typography>
          <Typography variant="p" className="text-gray-600">
            Fetching the latest data, hang tight!
          </Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center  w-full border-l-4 border-red-500">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <Typography variant="h3" className="text-gray-800 mb-3">
            Unable to Load Client
          </Typography>
          <Typography variant="p" className="text-gray-600 mb-6">
            {error}
          </Typography>
          <Button
            onClick={() => dispatch(fetchClientById(clientId))}
            className="bg-green-700 hover:bg-green-800 text-white"
          >
            <Info className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="border border-green-200 shadow-xl ">
      <CardHeader className=" border-b border-green-200 ">
       
          {/* Top Header */}
          <div className=" top-0 backdrop-blur-sm border-b border-gray-200 ">
            <div className="container w-full  py-4  flex items-center justify-between">
              <Button
                         variant="back"
                         size="sm"
                         onClick={() => router.back()}
                         className=""          >
                         <ArrowLeft className="h-5 w-5 mr-2" />
                         Back
                       </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                <Typography variant="small" className="text-gray-700">
                  Live Sync
                </Typography>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="py-6">
            <TabsList className="grid grid-cols-2 max-w-md bg-green-50 rounded-lg p-1 mb-6">
              <TabsTrigger
                value="info"
                className="rounded-md py-2 font-medium data-[state=active]:bg-green-700 data-[state=active]:text-white text-green-800"
              >
                Client Information
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="rounded-md py-2 font-medium data-[state=active]:bg-green-700 data-[state=active]:text-white text-green-800"
              >
                Projects ({projects.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {clientFields.map(({ key, label, icon: Icon }) => (
                    <div
                      key={key}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-green-50"
                    >
                      <div className="bg-green-100 p-2 rounded-full">
                        <Icon className="text-green-700 w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <Typography
                          variant="small"
                          className="text-gray-600 font-medium"
                        >
                          {label}
                        </Typography>
                        <Typography variant="p" className="text-black">
                          {key === "website" && formData[key] ? (
                            <a
                              href={formData[key]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-700 hover:underline"
                            >
                              {formData[key]}
                            </a>
                          ) : (
                            formData[key] || "Not provided"
                          )}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.fileData?.length > 0 && (
                  <div className="space-y-4">
                    <Typography
                      variant="h3"
                      className="flex items-center gap-2 text-black font-semibold"
                    >
                      <Download className="text-green-700" />
                      Attached Files ({formData.fileData.length})
                    </Typography>
                    <div className="space-y-3">
                      {formData.fileData.map((file, idx) => (
                        <div
                          key={idx}
                          className="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition"
                        >
                          <div className="flex items-center justify-between">
                            <Typography
                              variant="small"
                              className="text-black truncate"
                            >
                              {file.name}
                            </Typography>
                            <Button
                              asChild
                              size="sm"
                              className="bg-green-700 hover:bg-green-800 text-white"
                            >
                              <a
                                href={file.downloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="projects">
              {projects?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => {
                    const statusInfo =
                      statusConfig[project.status] || statusConfig.Planned;
                    return (
                      <div
                        key={project.projectId}
                        className="cursor-pointer bg-white rounded-lg border border-gray-200  transition"
                        onClick={() => handleProjectClick(project.projectId)}
                      >
                        <div
                          className={`h-1 bg-gradient-to-r ${statusInfo.gradient}`}
                        />
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <Typography
                              variant="h4"
                              className="font-semibold text-black"
                            >
                              {project.projectName}
                            </Typography>
                            <Badge
                              className={`${statusInfo.color} flex items-center gap-1`}
                            >
                              {statusInfo.icon}
                              <span className="text-xs">{project.status}</span>
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              <Briefcase className="text-green-700" />
                              <span>ID: {project.projectId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="text-green-700" />
                              <span>
                                {project.startDate} → {project.endDate}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="text-green-700" />
                              <span>Lead: {project.teamLeadName}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <List className="w-8 h-8 text-green-600" />
                  </div>
                  <Typography variant="h3" className="text-gray-700 mb-2">
                    No Projects Found
                  </Typography>
                  <Typography variant="p" className="text-gray-500">
                   {`This client doesn't have any associated projects yet.`}
                  </Typography>
                </div>
              )}
            </TabsContent>
          </Tabs>
     
      </CardHeader>
    </Card>
  );
}
