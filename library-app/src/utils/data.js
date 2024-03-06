const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "NAME", uid: "name", sortable: true},
  {name: "YEAR", uid: "year", sortable: true},
  {name: "STATUS", uid: "status", sortable: true},
  {name: "ACTIONS", uid: "actions"},
];

const statusOptions = [
  {name: "Active", uid: "active"},
  {name: "Paused", uid: "paused"},
];

const books = [
  {
    id: 1,
    name: "Cien años de soledad",
    status: "paused",
    year: "2024",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: 2,
    name: "La sombra del viento",
    status: "active",
    year: "2023",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
  }
 
];

export {columns, books, statusOptions};
