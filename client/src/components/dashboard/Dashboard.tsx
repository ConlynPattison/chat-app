"use client"
import { Room } from "@prisma/client";
import { useState } from "react";
import ChatRoomContainer from "./ChatRoomContainer";
import InboxesContainer from "./InboxesContainer";
import SideBar from "./SideBar/SideBar";

interface DashboardProps {
	realmId?: string
}

const Dashboard = ({ realmId }: DashboardProps) => {
	const defaultRoom: Room = {
		roomId: 829427992384792,
		roomName: "room1",
		isPrivate: false,
		realmId: 100,
		permissionsId: null
	}

	const [room, setRoom] = useState<Room>(defaultRoom);

	return (
		<div className="flex h-dvh">
			{/* Left edge nav bar */}
			<SideBar realmId={realmId} />

			{/* Outer container */}
			<div className="bg-red-600 w-[100%] overflow-y-auto h-[100%] sm:flex">

				{/* Left middle inbox & rooms */}
				<div className="bg-slate-800 sm:w-[400px] sm:h-[100%]">
					<InboxesContainer setRoom={setRoom} selectedRoom={room} />
				</div>

				{/* Right middle messages */}
				<div className="bg-slate-800 w-[100%] h-[100%]">
					{room && <ChatRoomContainer key={room.roomId} room={room} />}
				</div>

				{/* Right edge profile info */}
				<div className="bg-slate-900 sm:w-[300px] sm:h-[100%]">
				</div>
			</div>
		</div >
	);
}

export default Dashboard;