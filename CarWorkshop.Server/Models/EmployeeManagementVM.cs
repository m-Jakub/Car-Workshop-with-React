﻿namespace CarWorkshop.Server.Models
{
    public class EmployeeManagementVM
	{
		public IEnumerable<AppUser>? Employees { get; set; }
		public int Page { get; set; }
		public int PageSize { get; set; }
		public int TotalEmployees { get; set; }
	}
}
