import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, Mail, Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  prefillDestination?: string;
}

interface FormState {
  fullName: string;
  mobile: string;
  pickup: string;
  destination: string;
  travelDate: string;
  passengers: string;
  vehicleType: string;
  special: string;
}

interface FormErrors {
  fullName?: string;
  mobile?: string;
  pickup?: string;
  destination?: string;
  travelDate?: string;
  passengers?: string;
  vehicleType?: string;
}

const EMPTY_FORM: FormState = {
  fullName: "",
  mobile: "",
  pickup: "",
  destination: "",
  travelDate: "",
  passengers: "",
  vehicleType: "",
  special: "",
};

export function BookingModal({
  open,
  onClose,
  prefillDestination,
}: BookingModalProps) {
  const [form, setForm] = useState<FormState>(() => ({
    ...EMPTY_FORM,
    destination: prefillDestination ?? "",
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose();
      // reset after close animation
      setTimeout(() => {
        setForm({ ...EMPTY_FORM, destination: prefillDestination ?? "" });
        setErrors({});
        setSuccess(false);
        setSubmitting(false);
      }, 300);
    }
  }

  // keep destination in sync with prefill prop when modal opens
  const [prevOpen, setPrevOpen] = useState(false);
  if (open && !prevOpen) {
    setPrevOpen(true);
    setForm((f) => ({
      ...f,
      destination: prefillDestination ?? f.destination,
    }));
  }
  if (!open && prevOpen) {
    setPrevOpen(false);
  }

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.mobile.trim()) errs.mobile = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(form.mobile.trim()))
      errs.mobile = "Enter a valid 10-digit Indian mobile number";
    if (!form.pickup.trim()) errs.pickup = "Pickup location is required";
    if (!form.destination.trim()) errs.destination = "Destination is required";
    if (!form.travelDate) errs.travelDate = "Travel date is required";
    if (!form.passengers)
      errs.passengers = "Please select number of passengers";
    if (!form.vehicleType) errs.vehicleType = "Please select a vehicle type";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSuccess(true);
  }

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-lg w-full max-h-[90vh] overflow-y-auto p-0"
        data-ocid="booking.modal"
      >
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="font-display text-xl font-bold text-primary">
            🚗 Book Your Cab
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Fill in the details and our team will confirm shortly.
          </p>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="px-6 pb-8 pt-4 flex flex-col items-center text-center gap-4"
              data-ocid="booking.success_state"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={36} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground mb-1">
                  Booking Request Sent!
                </h3>
                <p className="text-muted-foreground text-sm">
                  Our team will call you shortly to confirm your booking.
                </p>
              </div>
              <div className="w-full bg-muted rounded-xl p-4 flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-foreground">
                  <Phone size={15} className="text-primary shrink-0" />
                  <span className="font-semibold">9990104748</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <Mail size={15} className="text-primary shrink-0" />
                  <span className="font-semibold">
                    meenagaurav4748@gmail.com
                  </span>
                </div>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90 text-white w-full font-semibold"
                onClick={() => handleOpenChange(false)}
                data-ocid="booking.close_button"
              >
                Close
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="px-6 pb-6 pt-2 flex flex-col gap-4"
              noValidate
            >
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="b-fullname" className="text-sm font-semibold">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="b-fullname"
                  placeholder="Your full name"
                  data-ocid="booking.input"
                  {...field("fullName")}
                />
                {errors.fullName && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="booking.error_state"
                  >
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="b-mobile" className="text-sm font-semibold">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="b-mobile"
                  type="tel"
                  placeholder="10-digit mobile number"
                  data-ocid="booking.input"
                  {...field("mobile")}
                />
                {errors.mobile && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="booking.error_state"
                  >
                    {errors.mobile}
                  </p>
                )}
              </div>

              {/* Pickup & Destination */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="b-pickup" className="text-sm font-semibold">
                    Pickup Location <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="b-pickup"
                    placeholder="e.g. Delhi"
                    data-ocid="booking.input"
                    {...field("pickup")}
                  />
                  {errors.pickup && (
                    <p
                      className="text-destructive text-xs"
                      data-ocid="booking.error_state"
                    >
                      {errors.pickup}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="b-dest" className="text-sm font-semibold">
                    Destination <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="b-dest"
                    placeholder="e.g. Jaipur"
                    data-ocid="booking.input"
                    {...field("destination")}
                  />
                  {errors.destination && (
                    <p
                      className="text-destructive text-xs"
                      data-ocid="booking.error_state"
                    >
                      {errors.destination}
                    </p>
                  )}
                </div>
              </div>

              {/* Travel Date */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="b-date" className="text-sm font-semibold">
                  Travel Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="b-date"
                  type="date"
                  min={today}
                  data-ocid="booking.input"
                  {...field("travelDate")}
                />
                {errors.travelDate && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="booking.error_state"
                  >
                    {errors.travelDate}
                  </p>
                )}
              </div>

              {/* Passengers & Vehicle */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-semibold">
                    Passengers <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.passengers}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, passengers: v }))
                    }
                  >
                    <SelectTrigger data-ocid="booking.select">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {["1", "2", "3", "4", "5", "6+"].map((n) => (
                        <SelectItem key={n} value={n}>
                          {n} Passenger{n !== "1" ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.passengers && (
                    <p
                      className="text-destructive text-xs"
                      data-ocid="booking.error_state"
                    >
                      {errors.passengers}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-semibold">
                    Vehicle Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.vehicleType}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, vehicleType: v }))
                    }
                  >
                    <SelectTrigger data-ocid="booking.select">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Sedan", "SUV", "Tempo Traveller", "Bus"].map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vehicleType && (
                    <p
                      className="text-destructive text-xs"
                      data-ocid="booking.error_state"
                    >
                      {errors.vehicleType}
                    </p>
                  )}
                </div>
              </div>

              {/* Special Requirements */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="b-special" className="text-sm font-semibold">
                  Special Requirements
                  <span className="text-muted-foreground font-normal ml-1">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="b-special"
                  placeholder="Any special needs, preferences, or requests..."
                  rows={3}
                  data-ocid="booking.textarea"
                  {...field("special")}
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="bg-primary hover:bg-primary/90 text-white font-semibold h-11 mt-1"
                data-ocid="booking.submit_button"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  "Confirm Booking Request"
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
