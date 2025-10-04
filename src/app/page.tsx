"use client";

import { DataTable } from "@/components/DataTable";
import { StringList } from "@/components/StringList";
import { Advocate } from "@/db/schema";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { ChangeEvent, useEffect, useState } from "react";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const searchTermElement = document.getElementById("search-term");
    if (!searchTermElement) throw new Error('unable to find search term element')
    searchTermElement.innerHTML = searchTerm;

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.specialties.find(value => value.includes(searchTerm)) ||
        advocate.phoneNumber.toString().includes(searchTerm) ||
        advocate.yearsOfExperience.toString().includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <DataTable<Advocate>
        data={filteredAdvocates}
        columns={[
          { header: "First Name", cell: (row) => row.firstName },
          { header: "Last Name", cell: (row) => row.lastName },
          { header: "City", cell: (row) => row.city },
          { header: "Degree", cell: (row) => row.degree },
          {
            header: "Specialties",
            cell: (row) => <StringList items={row.specialties} maxVisible={3} />,
          },
          {
            header: "Years of Experience",
            cell: (row) => row.yearsOfExperience,
          },
          { 
            header: "Phone Number", 
            cell: (row) => formatPhoneNumber(row.phoneNumber) 
          },
        ]}
        getRowKey={(row) => row.id}
      />
    </main>
  );
}
