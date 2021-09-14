new Vue({
	el : "#todoapp",
	data : {
		newTask : "test",
		tasks : [{label : "Complete Project",
					category : "Career",
					priority : 0,
					complete : false},
				{label : "Walk the Dog",
					category : "Household",
					priority : 1,
					complete : false},
				{label : "Wash the dishes",
					category : "Household",
					priority : 2,
					complete : false}]
	},
	methods : {
		addTask() {
			this.tasks.push({label : this.newTask, category : "None", priority : 0, complete : false})
			this.newTask = ""
		},
		deleteTask(task) {
			console.log(task)
			this.tasks = this.tasks.filter(function(value, index, tasks){
				return (value.label != task.label)
			})
		}
	}
})