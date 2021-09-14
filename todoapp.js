new Vue({
	el : "#todoapp",
	data : {
		newTaskLabel : "test",
		newTaskCategory : "",
		newTaskDueDate : "",
		newTaskPriority : 0,
		state : "view",
		tasks : [{label : "Complete Project",
					category : "Career",
					dueDate : "1999-11-15",
					priority : 0,
					complete : false},
				{label : "Walk the Dog",
					category : "Household",
					dueDate : "1999-11-15",
					priority : 1,
					complete : false},
				{label : "Wash the dishes",
					category : "Household",
					dueDate : "1999-11-15",
					priority : 2,
					complete : false}]
	},
	methods : {
		addTask() {
			this.tasks.push({label : this.newTaskLabel, category : "None", priority : 0, complete : false})
			this.newTaskLabel = ""
		},
		changeState(newState) {
			this.state = newState
		},
		deleteTask(task) {
			console.log(task)
			this.tasks = this.tasks.filter(function(value, index, tasks){
				return (value.label != task.label)
			})
		}
	}
})