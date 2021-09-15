new Vue({
	el : "#todoapp",
	data : {
		newTaskLabel : "test",
		newTaskCategory : "",
		newTaskDueDate : "",
		newTaskPriority : 0,
		state : "view",
		sortByLabelState : 0,
		sortByCategoryState : 0,
		sortByDueDateState : 0,
		sortByPriorityState : 0,
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
			this.tasks = this.tasks.filter(function(value, index, tasks){
				return (value.label != task.label);
			})
		},
		changeSortState(selectedState) {
			if (selectedState === "label") {
				this.sortByLabelState = (this.sortByLabelState + 1) % 3
				console.log(this.sortByLabelState)
			}
			if (selectedState === "category") {
				this.sortByCategoryState = (this.sortByCategoryState + 1) % 3
				console.log(this.sortByCategoryState)
			}
			if (selectedState === "due date") {
				this.sortByDueDateState = (this.sortByDueDateState + 1) % 3
				console.log(this.sortByDueDateState)
			}
			if (selectedState === "priority") {
				this.sortByPriorityState = (this.sortByPriorityState + 1) % 3
				console.log(this.sortByPriorityState)
			}
		},
		sortBy(list, field, activeFields) {
			//Insertion Sort
			newList = list[0];

			i = 1;
			while (list[i]){
				j = 0;
				console.log(list[i].label);
				i++;
			}
			return (list)
		}
	},
	computed : {
		sortedList() {
			//Using local Variables for shorthand
			lbl = this.sortByLabelState;
			ctg = this.sortByCategoryState;
			date = this.sortByDueDateState;
			prty = this.sortByPriorityState;
			activeFields = (lbl << 6) + (ctg << 4) + (date << 2) + prty;
			console.log((activeFields >>> 0).toString(2))

			//If the user has not selected a field to sort by display the reversed list
			if (!activeFields)
				return (this.tasks.slice(0).reverse());
			
			//Order of importance: Category, Due Date, Priority, Label
			//By sorting the list in order of least to most relevant, the final list will be properly ordered
			//i.e. label->category = each group of items in the same category will be adjacent and sorted alphebetically by label
			/*i.e : ***		AAAAAAAAA
					AAA		Household
					BBB		Household
					CCC		Household
					***		ZZZZZZZZZ
			*/
			list = this.tasks.slice(0).reverse();
			if (lbl)
				list = this.sortBy(list, "label", activeFields)
			if (prty)
				list = this.sortBy(list, "priority", activeFields)
			if (date)
				list = this.sortBy(list, "date", activeFields)
			if (ctg)
				list = this.sortBy(list, "category", activeFields)
			return(this.tasks)
		}
	}
})  