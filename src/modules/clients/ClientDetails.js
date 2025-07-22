


"use client";

import React, { useEffect } from "react";
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
  Info,
  AlertCircle,
  CheckCircle,
  Clock,
  List,
} from "lucide-react";
import {
  fetchClientById,
  fetchProjectsByClientId,
} from "@/features/clientSlice";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Typography from "@/components/ui/typography";

const statusConfig = {
  Planned: {
    color: "bg-warning text-warning-foreground",
    icon: <Clock className="w-4 h-4" />,
  },
  "In Progress": {
    color: "bg-info text-info-foreground",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  Completed: {
    color: "bg-success text-success-foreground",
    icon: <CheckCircle className="w-4 h-4" />,
  },
};

export default function ClientDetails() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id: clientId } = useParams();

  const {
    formData = {},
    fetchClientLoading: loading,
    fetchClientError: error,
    projects = [],
    fetchProjectsLoading: projectsLoading,
  } = useSelector((state) => state.client || {});

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-card rounded-xl shadow border border-border text-center space-y-3">
          <div className="w-10 h-10 border-4 border-muted rounded-full animate-spin border-t-primary mx-auto" />
          <Typography variant="h3" className="text-muted-foreground">
            Loading Client...
          </Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-card rounded-xl border-l-4 border-danger shadow space-y-3 text-center">
          <AlertCircle className="w-8 h-8 text-danger mx-auto" />
          <Typography variant="h3" className="text-destructive">
            Error loading client
          </Typography>
          <Typography variant="p">{error}</Typography>
          <Button
            onClick={() => dispatch(fetchClientById(clientId))}
            className="mt-2"
          >
            <Info className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-4">
        <Button
             variant="outline"
             onClick={() => router.back()}
             className="rounded-full text-gray-700 border border-gray-300 hover:bg-gray-100 px-3 py-1 flex-shrink-0"
           >
             <ArrowLeft className="h-4 w-4 mr-1" /> Back
           </Button>
    
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Client Info */}
        <Card className="p-2 border border-border shadow-sm rounded-xl">
          <CardHeader className="pb-0">
            <Typography variant="h3" className="text-lg font-semibold">
              Client Information
            </Typography>
          </CardHeader>
          <CardContent className="space-y-2">
            {clientFields.map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-start gap-3">
                <div className="bg-muted p-2 rounded-md">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <Typography variant="small" className="text-muted-foreground">
                    {label}
                  </Typography>
                  <Typography variant="p" className="text-foreground text-sm">
                    {key === "website" && formData[key] ? (
                      <a
                        href={formData[key]}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
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

            {/* Attached Files */}
            {formData.fileData?.length > 0 && (
              <div className="pt-4">
                <Typography variant="h4" className="mb-2">
                  Attached Files ({formData.fileData.length})
                </Typography>
                <div className="space-y-2">
                  {formData.fileData.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-muted px-3 py-2 rounded-md"
                    >
                      <Typography variant="small" className="truncate">
                        {file.name}
                      </Typography>
                      <Button asChild size="icon" variant="outline">
                        <a href={file.downloadLink} target="_blank">
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Projects */}
        <Card className="p-2 border border-border shadow-sm rounded-xl">
          <CardHeader className="pb-0">
            <Typography variant="h3" className="text-lg font-semibold">
              Recent Projects ({projects.length})
            </Typography>
          </CardHeader>
          <CardContent>
            {projects?.length > 0 ? (
              <div className="space-y-2">
                {projects.map((project) => {
                  const status = statusConfig[project.status] || statusConfig.Planned;
                  return (
                    <div
                      key={project.projectId}
                      onClick={() => handleProjectClick(project.projectId)}
                      className="cursor-pointer p-3 rounded-lg hover:bg-muted transition flex justify-between items-start border border-border"
                    >
                      <div>
                        <Typography variant="h4" className="text-sm font-semibold">
                          {project.projectName}
                        </Typography>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>ID: {project.projectId}</div>
                          <div>
                            {project.startDate} → {project.endDate}
                          </div>
                          <div>Lead: {project.teamLeadName}</div>
                        </div>
                      </div>
                      <Badge className={`${status.color} text-xs flex items-center gap-1`}>
                        {status.icon}
                        {project.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <List className="w-8 h-8 mx-auto text-muted mb-2" />
                <Typography variant="h4" className="text-muted-foreground">
                  No Projects Found
                </Typography>
                <Typography variant="p" className="text-muted-foreground text-sm">
                  This client has no associated projects yet.
                </Typography>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
