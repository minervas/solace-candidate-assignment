"use client";

import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { StringList } from "@/components/StringList";
import { Title } from "@/components/Title";
import { Advocate } from "@/db/schema";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PaginationMetadata } from "./api/advocates/route";

const PAGE_SIZE = 10;

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Derived state: get current page from URL parameters
  const currentPage = useMemo(() => {
    const pageParam = searchParams.get("page");
    if (!pageParam) return 1;
    
    const page = parseInt(pageParam, 10);
    return isNaN(page) || page < 1 ? 1 : page;
  }, [searchParams]);

  // Derived state: filter advocates based on search term
  const filteredAdvocates = useMemo(() => {
    if (!searchTerm) return advocates;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(lowerSearchTerm) ||
        advocate.lastName.toLowerCase().includes(lowerSearchTerm) ||
        advocate.city.toLowerCase().includes(lowerSearchTerm) ||
        advocate.degree.toLowerCase().includes(lowerSearchTerm) ||
        advocate.specialties.some(value => value.toLowerCase().includes(lowerSearchTerm)) ||
        advocate.phoneNumber.toString().includes(searchTerm) ||
        advocate.yearsOfExperience.toString().includes(searchTerm)
      );
    });
  }, [advocates, searchTerm]);

  const fetchAdvocates = (page: number) => {
    fetch(`/api/advocates?page=${page}&limit=${PAGE_SIZE}`)
      .then((response) => response.json())
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setPagination(jsonResponse.pagination);
      });
  };

  // Fetch advocates whenever the current page changes
  useEffect(() => {
    fetchAdvocates(currentPage);
  }, [currentPage]);

  // note that this filtering is done client-side (on the current page of data only)
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleReset = () => {
    setSearchTerm("");
  };

  const handlePageChange = (page: number) => {
    // Update URL with new page parameter
    router.push(`/?page=${page}`, { scroll: false });
    fetchAdvocates(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Title>Solace Advocates</Title>
        <SearchBar onSearch={handleSearch} onReset={handleReset} />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
        </div>
        {!searchTerm && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
          />
        )}
      </div>
    </main>
  );
}
