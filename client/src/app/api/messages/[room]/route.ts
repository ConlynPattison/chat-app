import mongo from "@/util/mongodb";
import prisma from "@/util/postgres";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Message, MessageForView } from "@chat-app/types";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type BaseUserData = {
	auth0Id: string,
	displayName: string,
	avatarUrl: string,
};

type UserMap = {
	[userId: string]: BaseUserData
};

const getQuerySchema = z.object({
	room: z.string().transform((id) => parseInt(id, 10))
});

const GET = withApiAuthRequired(async (req: NextRequest, { params }) => {
	try {
		/**
		 * In the future, this would be the case where we could use Redis
		 * -> rather than fetching all of the messages, fetch only the ones that are newest from
		 * the most recently cached Redis message (if there is not a new message, only use the cache)
		 */
		const parsedQueryParams = getQuerySchema.safeParse(params);
		if (!parsedQueryParams.success) {
			return NextResponse.json({ success: false, message: "Invalid arguments for getting messages provided" }, { status: 400 });
		}
		const { room } = parsedQueryParams.data;

		const messagesClient = await mongo();

		const messagesCollection = messagesClient.db("Cluster0").collection("messages");
		const cursor = messagesCollection.find<Message>(
			{
				room
			},
			{
				projection: {
					_id: 0,
					userId: 1,
					time: 1,
					room: 1,
					content: 1
				},
			});

		const messages: Message[] = [];
		for await (const message of cursor) {
			messages.push(message);
		}

		if (messages.length === 0) {
			return NextResponse.json([]);
		}

		const userIds = new Set(messages.map(message => message.userId));

		const users: BaseUserData[] = await prisma.user.findMany({
			where: {
				auth0Id: {
					in: Array.from(userIds)
				}
			},
			select: {
				auth0Id: true,
				avatarUrl: true,
				displayName: true
			}
		});

		const userToData = users.reduce((acc, user) => {
			acc[user.auth0Id] = user;
			return acc;
		}, {} as UserMap);

		const messagesWithUser: MessageForView[] = messages.map((msg: Message) => {
			return ({
				...msg,
				displayName: userToData[msg.userId]?.displayName ?? "Unknown User",
				avatarUrl: userToData[msg.userId]?.avatarUrl ?? ""
			});
		});

		return NextResponse.json(messagesWithUser);
	}
	catch (err) {
		console.error(err);
		return NextResponse.json({ success: false, message: `Server error: ${err}` }, { status: 500 })
	}
});

export { GET };
