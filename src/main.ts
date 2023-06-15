import "./style.css";
import { switchMap, map, Observable, take } from "rxjs";
import { fromFetch } from "rxjs/fetch";

interface DataDto {
  records: {
    fields: {
      availablecapacity: number;
      description: string;
      name: string;
      totalcapacity: number;
    };
  }[];
}

interface Data {
  availablecapacity: number;
  description: string;
  name: string;
  totalcapacity: number;
}

const fetchData$: Observable<Data[]> = fromFetch(
  "https://data.stad.gent/api/records/1.0/search/?dataset=bezetting-parkeergarages-real-time&q=&rows=20&start=1&sort=-occupation"
).pipe(
  switchMap((response) => response.json()),
  map((dataDto: DataDto) => {
    return dataDto.records.map((dataDto) => {
      return {
        availablecapacity: dataDto.fields.availablecapacity,
        description: dataDto.fields.description,
        name: dataDto.fields.name,
        totalcapacity: dataDto.fields.totalcapacity,
      };
    });
  }),
  take(1)
);

fetchData$.subscribe((data) => {
  console.log("data", data);
});

function updateTable() {
  let tableBody = "";

  fetchData$.subscribe((data) => {
    for (const [i, item] of data.entries()) {
      tableBody +=
        "<tr class='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>" +
        "<th scope='row' class='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>" +
        (i + 1) +
        "</th>" +
        "<td  class='px-6 py-4'>" +
        item.name +
        "</td>" +
        "<td class='px-6 py-4'>" +
        item.availablecapacity +
        "</span></td>" +
        "</tr>";
    }

    const table = document.getElementById("tablePrint");
    if (table) {
      table.innerHTML = tableBody;
    }
  });
}

updateTable();
