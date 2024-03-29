new Vue({
	el : "#todoapp",
	data : {
		newTaskLabel : "",
		newTaskCategory : "",
		newTaskDueDate : "",
		newTaskPriority : 0,
		state : "view",
		sortByLabelState : 0,
		sortByCategoryState : 0,
		sortByDueDateState : 0,
		sortByPriorityState : 0,
		sortIndicators : ["sortNone.png", "sortAsc.png", "sortDesc.png"],
		sortIndicatorLabel : "sortNone.png",
		sortIndicatorCategory : "sortNone.png",
		sortIndicatorDueDate : "sortNone.png",
		sortIndicatorPriority : "sortNone.png",
		tasks : [{label : "Complete Project",
					category : "Career",
					dueDate : "1999-11-15",
					priority : 0,
					class : "",
					complete : false},
				{label : "Walk the Dog",
					category : "Household",
					dueDate : "1999-11-15",
					priority : 1,
					class: "priority1",
					complete : false},
				{label : "Wash the dishes",
					category : "Household",
					dueDate : "1999-11-15",
					priority : 2,
					class : "priority2",
					complete : false}]
	},
	methods : {
		addTask() {
			this.tasks.push({label : this.newTaskLabel,
				category : this.newTaskCategory,
				dueDate : this.newTaskDueDate,
				priority : this.newTaskPriority,
				class : this.calcClass(this.newTaskPriority, false),
				complete : false})
			this.newTaskLabel = "";
			this.newTaskCategory = "";
			this.newTaskDueDate = "";
			this.newTaskPriority = 0;

			this.saveTasks();
		},
		calcClass(priority, complete) {
			var stringClass;

			if (complete)
				return ("strikethrough");
			
			if (priority) {
				stringClass = "priority" + priority.toString();
				return (stringClass);
			}
			
			return ("");
		},
		changeState(newState) {
			this.state = newState;
		},
		deleteTask(task) {
			this.tasks = this.tasks.filter(function(value, index, tasks){
				return (value.label != task.label);
			})

			this.saveTasks();
		},
		changeSortState(selectedState) {
			if (selectedState === "label") {
				this.sortByLabelState = (this.sortByLabelState + 1) % 3;
				this.sortIndicatorLabel = this.sortIndicators[this.sortByLabelState];
				localStorage.sortByLabelState = this.sortByLabelState;
			}

			if (selectedState === "category") {
				this.sortByCategoryState = (this.sortByCategoryState + 1) % 3;
				this.sortIndicatorCategory = this.sortIndicators[this.sortByCategoryState];
				localStorage.sortByCategoryState = this.sortByCategoryState;
			}

			if (selectedState === "due date") {
				this.sortByDueDateState = (this.sortByDueDateState + 1) % 3;
				this.sortIndicatorDueDate = this.sortIndicators[this.sortByDueDateState];
				localStorage.sortByDueDateState = this.sortByDueDateState;
			}

			//+2 because higher priority items are usually more relevant
			//So the sort state goes: 0, 2, 1
			//						None, desc, asc
			if (selectedState === "priority") {
				this.sortByPriorityState = (this.sortByPriorityState + 2) % 3;
				this.sortIndicatorPriority = this.sortIndicators[this.sortByPriorityState];
				localStorage.sortByPriorityState = this.sortByPriorityState;
			}
		},
		compareTasks(taskToInsert, taskCurrent, field, sortState) {
			var str1;
			var str2;

			if (field === "label") {
				str1 = taskToInsert.label;
				str2 = taskCurrent.label;
			}
			if (field === "category") {
				str1 = taskToInsert.category;
				str2 = taskCurrent.category;
			}
			if (field === "date") {
				str1 = taskToInsert.dueDate;
				str2 = taskCurrent.dueDate;
			}
			if (field === "priority") {
				str1 = taskToInsert.priority.toString();
				str2 = taskCurrent.priority.toString();
			}

			if (sortState === 1) {
				if (0 < str2.localeCompare(str1))
					return (true)
			}
			if (sortState === 2) {
				if (0 < str1.localeCompare(str2))
					return (true)
			}
			return (false);
		},
		sortBy(list, field, sortState) {
			//Insertion Sort
			var newList = [];
			newList.push(list[0]);

			i = 1;
			while (list[i]){
				j = 0;
				//Element that needs to be inserted into the new list
				taskToInsert = list[i];
				while (newList[j]) {
					//Compare against each element in the new list
					taskCurrent = newList[j];
					//If the current task's relevant field is less than (or more than) the taskToInserted's relavenat
					// field, insert the task to the new list
					if (this.compareTasks(taskToInsert, taskCurrent, field, sortState)) {
						newList.splice(j, 0, taskToInsert);
						break ;
					}

					//If the task is the last task then append the task to the new list
					if (!newList[j + 1]) {
						newList.push(taskToInsert);
						break ;
					}
					j++;
				}
				i++;
			}
			return (newList)
		},
		toggleComplete(task) {
			if (this.state === "view")
				task.complete = !task.complete;

			task.class = this.calcClass(task.priority, task.complete);
		},
		saveTasks() {
			const strTasks = JSON.stringify(this.tasks);

			localStorage.setItem('tasks', strTasks);
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
			if (lbl > 0)
				list = this.sortBy(list, "label", lbl);
			if (prty > 0)
				list = this.sortBy(list, "priority", prty);
			if (date > 0)
				list = this.sortBy(list, "date", date);
			if (ctg > 0)
				list = this.sortBy(list, "category", ctg);
			return(list)
		}
	},
	mounted() {
		if (localStorage.sortByLabelState) {
			this.sortByLabelState = parseInt(localStorage.sortByLabelState);
			this.sortIndicatorLabel = this.sortIndicators[this.sortByLabelState];
		}

		if (localStorage.sortByCategoryState) {
			this.sortByCategoryState = parseInt(localStorage.sortByCategoryState);
			this.sortIndicatorCategory = this.sortIndicators[this.sortByCategoryState];
		}

		if (localStorage.sortByDueDateState) {
			this.sortByDueDateState = parseInt(localStorage.sortByDueDateState);
			this.sortIndicatorDueDate = this.sortIndicators[this.sortByDueDateState];
		}

		if (localStorage.sortByPriorityState) {
			this.sortByPriorityState = parseInt(localStorage.sortByPriorityState);
			this.sortIndicatorPriority = this.sortIndicators[this.sortByPriorityState];
		}


		if (localStorage.tasks) {
			try {
				this.tasks = JSON.parse(localStorage.getItem('tasks'));
			} catch(e) {
				localStorage.removeItem('tasks');
			}
		}
	}
})