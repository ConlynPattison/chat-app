"use client"
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import ChatRoomContainer from "../components/MessagesContainer";

const Dashboard = () => {
	return (
		<div className="flex h-screen">
			{/* Left edge nav bar */}
			<div className="h-[100%] bg-blue-500 w-[80px]">
			</div>

			{/* Outer container */}
			<div className="bg-red-600 w-[100%] overflow-y-auto h-[100%] sm:flex">

				{/* Left middle inbox & rooms */}
				<div className="bg-blue-700 sm:w-[400px] sm:h-[100%]">
				</div>

				{/* Right middle messages */}
				<div className="bg-slate-400 w-[100%] h-[100%] p-2">
					<ChatRoomContainer room={"room1"} />
				</div>

				{/* Right edge profile info */}
				<div className="bg-violet-400 sm:w-[300px] sm:h-[100%]">
				</div>
			</div>
		</div>
	);
}

export default withPageAuthRequired(
	Dashboard,
	{
		returnTo: "/dashboard"
	}
)
