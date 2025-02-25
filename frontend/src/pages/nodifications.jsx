import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Loader } from "lucide-react";
import { IKImage } from "imagekitio-react";
import Skeleton from "react-loading-skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function Nodifications() {
  const { userId } = useAuth();
  console.log(userId);
  const queryClient = useQueryClient();
  const {
    data: notificationData,
    isLoading,
    isError,
    error,
    isSuccess,
    status,
    fetchStatus,
  } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      console.log(userId);
      try {
        const response = await axios.get(
          `http://localhost:3006/api/notification/${userId}`,
          { withCredentials: true }
        );
        if (response.data.length != 0) {
          toast.success("Notifications fetched successfully");
        }
        return response.data;
      } catch (error) {
        console.log(error);

        throw new Error(
          error.response.data.message || "Failed to fetch notifications"
        );
      }
    },
    enabled: Boolean(userId),
  });

  console.log(notificationData);
  const defaultImage = `https://robohash.org/${userId}.png`;

  const handleRequest = async (type, requestID, notificationID) => {
    try {
      const response = await axios.post(
        `http://localhost:3006/api/notification/handleRequest/${userId}`,
        { type, requestID, notificationID },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      queryClient.invalidateQueries(["notifications", userId]);
      toast.success("Request handled successfully");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col items-center mx-9  my-10 h-screen">
      {notificationData && notificationData.length !== 0
        ? notificationData.data.map((data) => {
            return (
              <div className="flex items-center  gap-4 w-full my-1 bg-gray-200 p-5 rounded-lg text-black relative">
                <img
                  src={data.image || defaultImage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <h1 className="text-lg font-bold mb-3.5">{data?.UserName}</h1>
                <Button
                  onClick={() =>
                    handleRequest("accept", data.requestID, data.notificationid)
                  }
                  variant="default"
                  className=" absolute right-30 cursor-pointer"
                >
                  Accept
                </Button>
                <Button
                  onClick={() =>
                    handleRequest("reject", data.requestID, data.notificationid)
                  }
                  variant="destructive"
                  className=" absolute right-10 cursor-pointer"
                >
                  Reject
                </Button>
                <p className="text-xs text-black rounded-sm p-1 absolute bottom-1 left-19 mb-3">
                  {data?.createdAt.split("T")[0]}
                </p>
              </div>
            );
          })
        : isLoading && (
            <div className="flex flex-col gap-4 p-4 w-full">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 w-full bg-gray-200/80 p-5 rounded-lg relative"
                >
                  <Skeleton className="h-10 w-10 rounded-full bg-gray-300" />
                  <Skeleton className="h-4 w-32 bg-gray-300" />
                  <div className="absolute right-30">
                    <Skeleton className="h-4 w-20 bg-gray-300 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}
      {notificationData?.data.length == 0 && (
        <p className="text-2xl font-bold">No Notifications Found</p>
      )}
      {isError && <p className="text-2xl font-bold"> {error.message}</p>}
    </div>
  );
}

export default Nodifications;
