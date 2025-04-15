type CreateSessionBody = {
	workout_type_id: number;
	date: string;
}

export const useCreateWorkoutSession = (
	date: string,
	setShowSessionModal: (val: boolean) => void
) => {

	const createWorkoutSession = async (type_id: number) => {
		const body: CreateSessionBody = {
			workout_type_id: type_id,
			date,
		};

		try {
			const response = await fetch(`http://127.0.0.1:8000/workout_session`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Session is created:", data);
			setShowSessionModal(false);
		} catch (error) {
			console.error("Failed to create session:", error);
			alert("Something went wrong while creating a session.");
		}
	};

	return createWorkoutSession;
};
