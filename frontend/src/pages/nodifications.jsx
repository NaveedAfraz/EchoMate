import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Loader } from "lucide-react";
import { IKImage } from "imagekitio-react";
import Skeleton from "react-loading-skeleton";
import { Button } from "@/components/ui/button";

function Nodifications() {
  const { userId } = useAuth();
  console.log(userId);

  const {
    data: notificationData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["nodifications"],
    queryFn: async () => {
      try {
        console.log(userId, "userId");
        if (!userId) {
          return;
        }
        const response = await axios.get(
          `http://localhost:3006/api/notification/${userId}`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.log(error.response.data);
        throw new Error(error.response.data.message);
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
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
                  className=" absolute right-30 "
                >
                  Accept
                </Button>
                <Button
                  onClick={() =>
                    handleRequest("reject", data.requestID, data.notificationid)
                  }
                  variant="destructive"
                  className=" absolute right-10 "
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
            <p className="text-2xl font-bold">
              <Loader className="animate-spin" />
            </p>
          )}
      {isError && <p className="text-2xl font-bold"> {error.message}</p>}
    </div>
  );
}

export default Nodifications;
