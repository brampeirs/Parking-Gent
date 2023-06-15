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
  let labelStatus = "";
  fetchData$.subscribe((data) => {
    for (const [i, item] of data.entries()) {
      if (item.availablecapacity < 150) {
        labelStatus = "label-danger";
      } else if (item.availablecapacity < 300) {
        labelStatus = "label-warning";
      } else {
        labelStatus = "label-success";
      }
      tableBody +=
        "<tr>" +
        "<th>" +
        (i + 1) +
        "</th>" +
        "<td>" +
        item.name +
        "</td>" +
        '<td><span class="label ' +
        labelStatus +
        '">' +
        item.availablecapacity +
        "</span></td>" +
        "</tr>";
    }

    document.getElementById("tablePrint").innerHTML = tableBody;
  });
}

updateTable();
