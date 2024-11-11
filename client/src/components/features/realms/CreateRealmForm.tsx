import axios from "axios";
import { RefObject } from "react";
import { mutate } from "swr";

interface CreateRealmFormProps {
	dialog: RefObject<HTMLDialogElement>
}

const CreateRealmForm = ({ dialog }: CreateRealmFormProps) => {
	const create = async (e: FormData) => {
		const isSearchable = e.get("realm_is_private");
		const realmName = e.get("realm_name");

		if (!realmName || typeof realmName !== "string") {
			alert("Failed to create realm");
			return;
		}

		axios.post("/api/realms", {
			body: {
				isSearchable: (isSearchable === null || isSearchable === "off") ? false : true,
				realmName
			},
		}).then(create => {
			if (create.status === 200) {
				alert("Realm successfully created!");
				mutate("/api/realms");
			}

			dialog.current?.close();
		}).catch(e => {
			console.error(e);
			alert("Failed to create realm, invalid arguments provided.");
		});
	}

	return (
		<form action={create}>
			<div className="flex flex-col">
				<label>Name:
					<input
						name="realm_name"
						required
						maxLength={16}
						placeholder="Name your realm..." /></label>
				<label>Is this Realm Private?
					<input
						name="realm_is_private"
						type="checkbox" /></label>
				<button type="submit">Submit</button>
			</div>
		</form>
	);
};

export default CreateRealmForm;
