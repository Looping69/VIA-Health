"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createClient } from "../../../../supabase/client";
import { useRouter } from "next/navigation";
import { Database, ArrowLeft, Play, Shield, RefreshCw } from "lucide-react";
import AdminPanel from "@/components/admin/admin-panel";

type TableInfo = {
  name: string;
  schema: string;
  rowCount: number;
};

export default function DatabaseManagementPage() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [sqlQuery, setSqlQuery] = useState("");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);

      // Query to get all tables and their row counts
      const { data, error } = await supabase.rpc("get_all_tables");

      if (error) {
        console.error("Error fetching tables:", error);
        return;
      }

      setTables(data || []);
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const executeQuery = async () => {
    if (!sqlQuery.trim()) return;

    try {
      setIsExecuting(true);
      setQueryError(null);

      // Execute the SQL query
      const { data, error } = await supabase.rpc("execute_sql", {
        query_text: sqlQuery,
      });

      if (error) {
        setQueryError(error.message);
        setQueryResult(null);
        return;
      }

      setQueryResult(data);
    } catch (error: any) {
      setQueryError(error.message || "An error occurred");
      setQueryResult(null);
    } finally {
      setIsExecuting(false);
    }
  };

  const viewTableData = async (tableName: string) => {
    setSqlQuery(`SELECT * FROM ${tableName} LIMIT 100;`);
    executeQuery();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="h-6 w-6 mr-2 text-red-600" />
            Database Management
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tables List */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Database Tables</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchTables}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">Loading tables...</div>
              ) : (
                <div className="overflow-y-auto max-h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Table Name</TableHead>
                        <TableHead className="text-right">Rows</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tables.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-4">
                            No tables found
                          </TableCell>
                        </TableRow>
                      ) : (
                        tables.map((table) => (
                          <TableRow
                            key={`${table.schema}.${table.name}`}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() =>
                              viewTableData(`${table.schema}.${table.name}`)
                            }
                          >
                            <TableCell className="font-medium">
                              {table.name}
                              <div className="text-xs text-gray-500">
                                {table.schema}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {table.rowCount}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>

          {/* SQL Query Editor */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">SQL Query Editor</h2>

              <div className="space-y-4">
                <Textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  placeholder="Enter SQL query here..."
                  className="font-mono text-sm h-32"
                />

                <div className="flex justify-end">
                  <Button
                    onClick={executeQuery}
                    disabled={isExecuting || !sqlQuery.trim()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isExecuting ? "Executing..." : "Execute Query"}
                  </Button>
                </div>

                {queryError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                    <p className="font-medium">Error:</p>
                    <p className="text-sm">{queryError}</p>
                  </div>
                )}

                {queryResult && (
                  <div className="border rounded-md overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {queryResult.length > 0 &&
                            Object.keys(queryResult[0]).map((column) => (
                              <TableHead key={column}>{column}</TableHead>
                            ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {queryResult.map((row: any, rowIndex: number) => (
                          <TableRow key={rowIndex}>
                            {Object.values(row).map(
                              (value: any, colIndex: number) => (
                                <TableCell key={colIndex}>
                                  {value === null ? (
                                    <span className="text-gray-400 italic">
                                      null
                                    </span>
                                  ) : typeof value === "object" ? (
                                    JSON.stringify(value)
                                  ) : (
                                    String(value)
                                  )}
                                </TableCell>
                              ),
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminPanel />
    </div>
  );
}
