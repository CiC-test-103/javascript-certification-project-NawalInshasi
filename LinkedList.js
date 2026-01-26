// Necessary Imports (you will need to use this)
const { Student } = require('./Student.js')
const fs = require("fs").promises;

/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data               // Student
  next               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0; 
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
   addStudent(newStudent) {
        let newNode = new Node(newStudent);
            //if the linked list is empty
            if(!this.head){
                this.head = newNode;
                this.tail = newNode;
                this.length++;
                return;
            }
            
            //if the linked list is not empty
            this.tail.next = newNode;
            this.tail = newNode;
            this.length++;
    }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {
      //4 cases
      //Case 1: if the linked list is empty
      if (!this.head){
        console.log("Empty Linked List!");
        return;
      } 

      // Case 2 A: : if the email was for the head element and it's the only element in the Linked List

      if (this.length ===1 && this.head.data.getEmail() === email) {
        this.head = null;
        this.tail = null;
        this.length = 0;
      return;
      }
      
      // Case 2 B: if the email was for the head element 
      if (this.head.data.getEmail() === email) {
        this.head = this.head.next;
        this.length--;
        return;
      }
      
      // case 3 and 4 : if the email was for the tail element or any other element inside the LinkedList
      let temp = this.head;
      let prev = this.head;
      
      while (temp.next) {     // while we did not reach the last element
        if (temp.next.data.getEmail() === email) {
            // case 3: if the email was for the tail element
            if (temp.next === this.tail) { 
            this.tail = temp;
            this.tail.next = null;
            this.length--;
            return;
          }
        
        // if the email was for anyother element inside the LinkedList
        prev.next = temp.next.next;;  
        this.length--;
        return;
        }

      prev = temp;
      temp = temp.next;
      }
    }

   /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  
  findStudent(email) {
        let current = this.head;
        while(current){
            if(current.data.getEmail() === email){
            return current.data;
            }
            current = current.next;        
            }
        // If not found
        return -1;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  
  #clearStudents() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  clear() {
  this.#clearStudents();
}

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    if (!this.head) {
        return ""; // Empty list returns empty string
    }

    let current = this.head;
    const result = [];

    while (current) {
        result.push(current.data.getName()); // Get each student data
        current = current.next; //move to next student
    }

    // Join all names with a comma and space
    return result.join(", ");
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  #sortStudentsByName() {
    // Step 1: Create an empty array to hold students
    let studentsArray = [];

    // Step 2: Start at the head of the linked list
    let current = this.head;

    // Step 3: Traverse the linked list
    while (current) {
        // Add the Student object from the current node to the array
        studentsArray.push(current.data);

        // Move to the next node
        current = current.next;
    }

    // Step 4: Sort the array alphabetically by student name
    // a.getName() and b.getName() get the names of the students
    studentsArray.sort((a, b) => {
        if (a.getName() < b.getName()) return -1;
        if (a.getName() > b.getName()) return 1;
        return 0; // names are equal
    });

    // Step 5: Return the sorted array of students
    return studentsArray;
}

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
  // Step 1: Get all students sorted by name
  let sortedStudents = this.#sortStudentsByName();

  // Step 2: Prepare result array
  let filteredStudents = [];

  // Step 3: Use while loop to filter
  let i = 0;
  while (i < sortedStudents.length) {
    if (sortedStudents[i].getSpecialization().toLowerCase() === specialization.toLowerCase()) {
       filteredStudents.push(sortedStudents[i]);
    }
    i++;
   }

  // Step 4: Return sorted + filtered students
  return filteredStudents;
}


    /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinAge(minAge) {
  // Step 1: Convert minAge to minimum university year
  // Students start university at age 19 → first year
  let minYearInUniversity = minAge - 18;

  // Step 2: Get all students sorted by name
  let sortedStudents = this.#sortStudentsByName();

  // Step 3: Prepare an array for filtered students
  let filteredStudents = [];

  // Step 4: Filter using while loop
  let i = 0;
  while (i < sortedStudents.length) {
    if (sortedStudents[i].getYear() >= minYearInUniversity) {
      filteredStudents.push(sortedStudents[i]);
    }
    i++;
  }

  // Step 5: Return filtered and sorted array
  return filteredStudents;
}
  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  
async saveToJson(fileName) {
  try {
    let studentsArray = [];
    let current = this.head;

    // Convert LinkedList → objects
    while (current) {
      studentsArray.push({
        name: current.data.getName(),
        year: current.data.getYear(),
        email: current.data.getEmail(),
        specialization: current.data.getSpecialization()
      });

      current = current.next;
    }

    const jsonData = JSON.stringify(studentsArray, null, 2); // null : with no changes, 2: double indentation for easy reading
    await fs.writeFile(fileName, jsonData);

    console.log("LinkedList saved successfully to JSON file");
  } catch (error) {
    console.error("Error saving to JSON:", error);
  }
}


 /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */

 async loadFromJSON(fileName) {
  try {
    const fs = require("fs").promises;

    // Read file
    const fileData = await fs.readFile(fileName, "utf-8");

    // Parse JSON
    const studentsArray = JSON.parse(fileData);

    // Clear existing list
    this.#clearStudents();
    this.head = null;
    this.tail = null;
    this.length = 0;

    // Rebuild list using WHILE
    let i = 0;
    while (i < studentsArray.length) {
      const obj = studentsArray[i];

      const student = new Student(
        obj.name,
        obj.year,
        obj.email,
        obj.specialization
      );

      this.addStudent(student);
      i++;
    }

  } catch (error) {
    console.error("Error loading from JSON:", error);
  }
}
}

module.exports = { LinkedList }
