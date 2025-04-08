import { useState } from "react";

type Workout = {
  name: string;
  reps: number;
  weight: number;
  sets: number;
  date?: string;
}

type Props = {
  workoutsToday: Workout[];
	date: string;
};

const Logs: React.FC<Props> = ({ workoutsToday, date }) => {
	const [addWorkout, setAddWorkout] = useState(false);
	const [newWorkout, setNewWorkout] = useState({
		name: "",
		reps: 0,
		weight: 0,
		sets: 0,
	});

	const handleSaveWorkout = async () => {
		try {
			const response = await fetch(`http://127.0.0.1:8000/create_workout?name=${newWorkout.name}&reps=${newWorkout.reps}&weight=${newWorkout.weight}&sets=${newWorkout.sets}&date=${date}`, {
				method: "POST",
			});
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
	
			const data = await response.json();
			console.log("Workout saved:", data);
			setAddWorkout(false)
		} catch (error) {
			console.error("Failed to save workout:", error);
			alert("Something went wrong while saving the workout.");
		}
	};

  return (
		<div className="bg-white p-4 rounded-xl shadow-lg relative my-3 w-full">
			<button
				onClick={() => setAddWorkout(true)}
				className="absolute top-4 right-4 text-white bg-sky-600 hover:bg-sky-700 w-8 h-8 flex items-center justify-center rounded-full shadow"
			>
				+
			</button>

			{addWorkout ? (
				<div className="mt-10 space-y-4">
					<input
						type="text"
						placeholder="Workout name"
						value={newWorkout.name}
						onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
						className="w-full px-4 py-2 bg-slate-100 rounded"
					/>
					<input
						type="number"
						placeholder="Reps"
						value={newWorkout.reps}
						onChange={(e) => setNewWorkout({ ...newWorkout, reps: Number(e.target.value) })}
						className="w-full px-4 py-2 bg-slate-100 rounded"
					/>
					<input
						type="number"
						placeholder="Weight (kg)"
						value={newWorkout.weight}
						onChange={(e) => setNewWorkout({ ...newWorkout, weight: Number(e.target.value) })}
						className="w-full px-4 py-2 bg-slate-100 rounded"
					/>
					<input
						type="number"
						placeholder="Sets"
						value={newWorkout.sets}
						onChange={(e) => setNewWorkout({ ...newWorkout, sets: Number(e.target.value) })}
						className="w-full px-4 py-2 bg-slate-100 rounded"
					/>
					<div className="flex justify-end space-x-2">
						<button
							onClick={handleSaveWorkout}
							className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
						>
							Save
						</button>
						<button
							onClick={() => setAddWorkout(false)}
							className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<div className="mt-10 space-y-2">
					{workoutsToday.length > 0 ? (
						workoutsToday.map((log, index) => (
							<div key={index} className="px-2 text-left">
								<div className="flex justify-between items-center">
									<div>
										<div>
											{log.name}
										</div>
										<div className="flex space-x-4">
											<span>{log.weight}kg</span>
											<span>{log.reps} reps</span>
											<span>{log.sets} sets</span>
										</div>
									</div>
									<button
										// onClick={() => handleEdit(index)}
										className="text-blue-500 hover:text-blue-700"
									>
										edit &gt;
									</button>
								</div>
								<div className="border-b border-gray-300 my-3"></div>
							</div>
						))
					) : (
						<p className="text-gray-500">No logs for this day.</p>
					)}
				</div>
			)}
		</div>
  );
};

export default Logs;