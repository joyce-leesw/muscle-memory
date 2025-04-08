type Workout = {
  name: string;
  reps: number;
  weight: number;
  sets: number;
  date?: string;
}

type Props = {
  workoutsToday: Workout[];
};

const Logs: React.FC<Props> = ({ workoutsToday }) => {
  return (
		<div className="bg-white p-4 rounded-xl shadow-lg relative my-3 w-full">
			<button
				// onClick={handleAddWorkout}
				className="absolute top-4 right-4 text-white bg-sky-600 hover:bg-sky-700 w-8 h-8 flex items-center justify-center rounded-full shadow"
			>
				+
			</button>

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
		</div>
  );
};

export default Logs;