import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActor } from "@/hooks/useActor";
import { Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";

const ADMIN_PIN = "9990104748";

interface BookingRequest {
  id: bigint;
  fullName: string;
  mobile: string;
  pickup: string;
  destination: string;
  travelDate: string;
  passengers: string;
  vehicleType: string;
  special: string;
  submittedAt: bigint;
}

function formatDate(nanos: bigint): string {
  const ms = Number(nanos) / 1_000_000;
  return new Date(ms).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminBookings() {
  const { actor, isFetching } = useActor();
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [pinError, setPinError] = useState("");
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  function handleLogin() {
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
      setPinError("");
      fetchBookings();
    } else {
      setPinError("Incorrect PIN. Please try again.");
    }
  }

  async function fetchBookings() {
    if (!actor) return;
    setLoading(true);
    setFetchError("");
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (await (
        actor as any
      ).getAllBookings()) as BookingRequest[];
      setBookings(
        [...result].sort((a, b) => Number(b.submittedAt - a.submittedAt)),
      );
    } catch (err) {
      console.error(err);
      setFetchError("Failed to load bookings. Please refresh.");
    } finally {
      setLoading(false);
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck size={28} className="text-primary" />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Admin Login
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              Meena Tour and Travels — Booking Dashboard
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="admin-pin"
              className="text-sm font-semibold text-foreground"
            >
              Enter Admin PIN
            </label>
            <Input
              id="admin-pin"
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              data-ocid="admin.input"
            />
            {pinError && (
              <p
                className="text-destructive text-xs"
                data-ocid="admin.error_state"
              >
                {pinError}
              </p>
            )}
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-white font-semibold h-11"
            onClick={handleLogin}
            data-ocid="admin.primary_button"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Booking Requests
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Meena Tour and Travels — Admin Dashboard
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchBookings}
            disabled={loading || isFetching}
            data-ocid="admin.secondary_button"
          >
            {loading ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <RefreshCw size={16} className="mr-2" />
            )}
            Refresh
          </Button>
        </div>

        {fetchError && (
          <div
            className="bg-destructive/10 text-destructive rounded-lg p-4 mb-4 text-sm"
            data-ocid="admin.error_state"
          >
            {fetchError}
          </div>
        )}

        {loading ? (
          <div
            className="flex items-center justify-center py-20"
            data-ocid="admin.loading_state"
          >
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-muted-foreground"
            data-ocid="admin.empty_state"
          >
            <p className="text-lg font-medium">No bookings yet</p>
            <p className="text-sm mt-1">Booking requests will appear here.</p>
          </div>
        ) : (
          <div
            className="rounded-xl border border-border overflow-hidden shadow-sm"
            data-ocid="admin.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Passengers</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Special Notes</TableHead>
                  <TableHead>Submitted At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b, i) => (
                  <TableRow
                    key={String(b.id)}
                    data-ocid={`admin.item.${i + 1}`}
                  >
                    <TableCell className="font-medium text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {b.fullName}
                    </TableCell>
                    <TableCell>
                      <a
                        href={`tel:${b.mobile}`}
                        className="text-primary hover:underline"
                      >
                        {b.mobile}
                      </a>
                    </TableCell>
                    <TableCell>{b.pickup}</TableCell>
                    <TableCell>{b.destination}</TableCell>
                    <TableCell>{b.travelDate}</TableCell>
                    <TableCell>{b.passengers}</TableCell>
                    <TableCell>{b.vehicleType}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {b.special || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                      {formatDate(b.submittedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
