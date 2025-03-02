import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
function AddMembers({ open, setOpen, users, groupId }) {
  const queryClient = useQueryClient();
  const [addingUser, setAddingUser] = useState(null);

  // Fetch existing group members
  const { data: groupMembers, isLoading: loadingMembers } = useQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://localhost:3006/api/users/group-members/${groupId}`,
          { withCredentials: true }
        );
        return response.data || [];
      } catch (error) {
        console.error("Error fetching group members:", error);
        return [];
      }
    },
    enabled: !!groupId && open,
  });

  // Add member mutation
  const { mutate: addMember } = useMutation({
    mutationFn: async (userId) => {
      setAddingUser(userId);
      const response = await axios.post(
        `http://localhost:3006/api/users/addParticipantsINGroup`,
        {
          participantID: userId,
          conversationID: groupId,
        },
        { withCredentials: true }
      );
      return response.data;
    },
    onSettled: (data, error) => {
      if (error) {
        toast.error(error.response?.data?.message || "Failed to add member");
      } else {
        toast.success("Member added successfully");

        queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
      }
      setAddingUser(null);
    },
  });

  const ids = groupMembers?.map((member) => member.participantID);
  const filteredUsers = users.filter((user) => {
    return !ids?.includes(user.id);
  });
  console.log(filteredUsers, "filteredUsers");
  console.log(groupMembers, "groupMembers");
  console.log(users, "users");

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Members</DialogTitle>
          </DialogHeader>

          {loadingMembers ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center p-4 text-gray-500">
              All users are already in this group
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 bg-gray-950 text-white p-3 rounded-2xl relative"
                >
                  <div className="w-10 h-10">
                    <img
                      src={user.image}
                      alt="profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <p>{user.UserName}</p>
                  <Button
                    onClick={() => addMember(user.id)}
                    disabled={addingUser === user.id}
                    className="bg-green-700 absolute right-5 hover:bg-green-700 text-white"
                  >
                    {addingUser === user.id ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                    ) : (
                      <div className="text-xs">Add</div>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddMembers;
