export const formatDate = (dateString) => {
  try {
    // Early return if no date provided
    if (!dateString) {
      console.log("No date string provided");
      return "No date";
    }
    
   
    
    // Try parsing the date
    let date;
    
    if (typeof dateString === 'string') {
      // Try parsing as ISO string first
      date = new Date(dateString);
      
      // If that fails, try parsing as timestamp
      if (isNaN(date.getTime()) && !isNaN(dateString)) {
        date = new Date(parseInt(dateString));
      }
      
      // If that fails too, try parsing DD-MM-YYYY format
      if (isNaN(date.getTime())) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
          date = new Date(parts[2], parts[1] - 1, parts[0]);
        }
      }
    } else if (dateString instanceof Date) {
      date = dateString;
    } else {
      date = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.log("Invalid date after parsing:", dateString);
      return "Invalid date";
    }
    
    // Format the date
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
};

export function dateFormatter(dateString) {
  try {
    if (!dateString) return "";
    
    let inputDate;
    if (typeof dateString === 'string') {
      // Try parsing ISO string
      inputDate = new Date(dateString);
      
      // If invalid, try parsing other formats
      if (isNaN(inputDate.getTime())) {
        // Try parsing DD-MM-YYYY
        const parts = dateString.split('-');
        if (parts.length === 3) {
          inputDate = new Date(parts[2], parts[1] - 1, parts[0]);
        }
      }
    } else if (dateString instanceof Date) {
      inputDate = dateString;
    } else {
      return "";
    }

    if (isNaN(inputDate.getTime())) {
      return "";
    }

    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const day = String(inputDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
}

export function getInitials(fullName) {
    const names = fullName.split(" ");
  
    const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());
  
    const initialsStr = initials.join("");
  
    return initialsStr;
  }

  export const PRIOTITYSTYELS = {
    high: "text-red-600",
    medium: "text-yellow-600",
    low: "text-blue-600",
  };
  
  export const TASK_TYPE = {
    todo: "bg-blue-600",
    "in progress": "bg-yellow-600",
    completed: "bg-green-600",
  };
  
  export const BGS = [
    "bg-blue-600",
    "bg-yellow-600",
    "bg-red-600",
    "bg-green-600",
  ];
  