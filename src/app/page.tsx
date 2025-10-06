"use client";

import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { StringList } from "@/components/StringList";
import { Title } from "@/components/Title";
import { Advocate } from "@/db/schema";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { useEffect, useState, useMemo, useCallback } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch advocates whenever the current page changes
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchAdvocates = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `/api/advocates?page=${currentPage}&limit=${PAGE_SIZE}`,
          { signal: abortController.signal }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch advocates: ${response.statusText}`);
        }
        
        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data);
        setPagination(jsonResponse.pagination);
      } catch (err) {
        // Ignore abort errors - they're expected when component unmounts or page changes
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        
        setError(err instanceof Error ? err.message : "An error occurred");
        setAdvocates([]);
        setPagination({
          page: 1,
          limit: PAGE_SIZE,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        });
      } finally {
        // Only update loading state if the request wasn't aborted
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchAdvocates();
    
    // Cleanup: abort the fetch request if component unmounts or currentPage changes
    return () => {
      abortController.abort();
    };
  }, [currentPage]);

  // note that this filtering is done client-side (on the current page of data only)
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleReset = useCallback(() => {
    setSearchTerm("");
  }, []);

  const handlePageChange = useCallback((page: number) => {
    // Update URL - this will trigger useEffect which calls fetchAdvocates
    router.push(`/?page=${page}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [router]);
  const columns = useMemo(() => [
    { header: "First Name", cell: (row: Advocate) => row.firstName, id: "firstName" },
    { header: "Last Name", cell: (row: Advocate) => row.lastName, id: "lastName" },
    { header: "City", cell: (row: Advocate) => row.city, id: "city" },
    { header: "Degree", cell: (row: Advocate) => row.degree, id: "degree" },
    {
      header: "Specialties",
      cell: (row: Advocate) => <StringList items={row.specialties} maxVisible={3} />,
      id: "specialties",
    },
    {
      header: "Years of Experience",
      cell: (row: Advocate) => row.yearsOfExperience,
      id: "yearsOfExperience",
    },
    { 
      header: "Phone Number", 
      cell: (row: Advocate) => formatPhoneNumber(row.phoneNumber),
      id: "phoneNumber",
    },
  ], []);
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Title>Solace Advocates</Title>
        <SearchBar onSearch={handleSearch} onReset={handleReset} />
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">Error: {error}</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading advocates...</p>
            </div>
          ) : (
            <DataTable<Advocate>
              data={filteredAdvocates}
              columns={columns}
              getRowKey={(row) => row.id}
            />
          )}
        </div>
        
        {!searchTerm && !isLoading && (
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
