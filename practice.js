const company = {
  name: "Tech Solutions Ltd",
  location: {
    city: "Dhaka",
    country: "Bangladesh",
    offices: [
      { branch: "Gulshan", employees: 120 },
      { branch: "Banani", employees: 80 },
    ],
  },
  departments: [
    {
      name: "Engineering",
      manager: { name: "Rahim", age: 35 },
      teams: [
        {
          teamName: "Backend",
          members: ["Tareq", "Sakib", "Fahim"],
        },
        {
          teamName: "Frontend",
          members: ["Nadia", "Afsana"],
        },
      ],
    },
    {
      name: "Sales",
      manager: { name: "Karim", age: 40 },
      clients: [
        { name: "ABC Corp", contractValue: 50000 },
        { name: "XYZ Ltd", contractValue: 75000 },
      ],
    },
  ],
  products: [
    {
      id: 1,
      name: "SaaS Platform",
      versions: [
        { version: "1.0", releaseDate: "2023-01-10" },
        { version: "2.0", releaseDate: "2024-06-15" },
      ],
    },
    {
      id: 2,
      name: "Mobile App",
      versions: [{ version: "1.0", releaseDate: "2023-11-05" }],
    },
  ],
  isActive: true,
};


let companyName = company["name"];
console.log(companyName);
