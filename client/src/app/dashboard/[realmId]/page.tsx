"use server"
import Dashboard from "@/components/dashboard/Dashboard";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const DashboardRealmPage = async () => {
	console.log("realming ***")

	return (
		<Dashboard showDirectMessages={false} />
	);
}

export default withPageAuthRequired(
	DashboardRealmPage,
	{
		returnTo: "/dashboard"
	}
);
