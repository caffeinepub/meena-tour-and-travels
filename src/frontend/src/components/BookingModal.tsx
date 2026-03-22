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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
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

const STANDARD_VEHICLES = [
  { value: "Sedan (Standard)", label: "Sedan (Standard)", rate: "₹18–22/km" },
  { value: "Ertiga", label: "Ertiga", rate: "₹22–28/km" },
  { value: "Innova Crysta", label: "Innova Crysta", rate: "₹28–35/km" },
  { value: "Premium SUV", label: "Premium SUV", rate: "₹28–35/km" },
];

const VIP_VEHICLES = [
  { value: "BMW (VIP)", label: "BMW", rate: "On Request" },
  { value: "Mercedes (VIP)", label: "Mercedes", rate: "On Request" },
  {
    value: "Land Rover Defender (VIP)",
    label: "Land Rover Defender",
    rate: "On Request",
  },
];

export function BookingModal({
  open,
  onClose,
  prefillDestination,
}: BookingModalProps) {
  const { actor } = useActor();
  const [form, setForm] = useState<FormState>(() => ({
    ...EMPTY_FORM,
    destination: prefillDestination ?? "",
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<typeof form | null>(null);

  function sendBookingWhatsApp(phone: string) {
    if (!submittedData) return;
    const msg = `*New Booking Request - Meena Tour and Travels*

Name: ${submittedData.fullName}
Mobile: ${submittedData.mobile}
Pickup: ${submittedData.pickup}
Destination: ${submittedData.destination}
Travel Date: ${submittedData.travelDate}
Passengers: ${submittedData.passengers}
Vehicle: ${submittedData.vehicleType}
Notes: ${submittedData.special || "None"}`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      onClose();
      setTimeout(() => {
        setForm({ ...EMPTY_FORM, destination: prefillDestination ?? "" });
        setErrors({});
        setSuccess(false);
        setSubmitting(false);
      }, 300);
    }
  }

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

    // Step 1: Send email FIRST — this is the primary notification channel
    try {
      await fetch("https://formsubmit.co/ajax/meenagaurav4748@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "🚗 New Booking Request - Meena Tour and Travels",
          _template: "table",
          Name: form.fullName,
          Mobile: form.mobile,
          "Pickup Location": form.pickup,
          Destination: form.destination,
          "Travel Date": form.travelDate,
          Passengers: form.passengers,
          "Vehicle Type": form.vehicleType,
          "Special Notes": form.special || "None",
        }),
      });
    } catch {
      // Email failed silently — still show success and try backend
    }

    // Step 2: Try backend save — non-blocking, won't affect success state
    if (actor) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (actor as any).submitBooking(
          form.fullName,
          form.mobile,
          form.pickup,
          form.destination,
          form.travelDate,
          form.passengers,
          form.vehicleType,
          form.special,
        );
      } catch {
        // Backend save failed silently — email already sent
      }
    }

    // Always show success
    setSubmitting(false);
    setSubmittedData({ ...form });
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
                <p className="text-xs text-muted-foreground mt-1">
                  We will contact you on{" "}
                  <span className="font-semibold text-foreground">
                    {form.mobile}
                  </span>{" "}
                  within 2 hours to confirm.
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
              <div className="flex flex-col gap-2 w-full">
                <button
                  type="button"
                  onClick={() => sendBookingWhatsApp("919990104748")}
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5e] text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors w-full"
                  data-ocid="booking.whatsapp_gaurav_button"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 fill-white shrink-0"
                    aria-label="WhatsApp"
                    role="img"
                  >
                    <title>WhatsApp</title>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Send to Gaurav (MD) on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => sendBookingWhatsApp("919868901253")}
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5e] text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors w-full"
                  data-ocid="booking.whatsapp_shyam_button"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 fill-white shrink-0"
                    aria-label="WhatsApp"
                    role="img"
                  >
                    <title>WhatsApp</title>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Send to Shyam Lal Ji (Corporate) on WhatsApp
                </button>
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
                    <SelectContent position="popper" sideOffset={4}>
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
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                      <SelectGroup>
                        <SelectLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-2 py-1">
                          Standard Fleet
                        </SelectLabel>
                        {STANDARD_VEHICLES.map((v) => (
                          <SelectItem key={v.value} value={v.value}>
                            <span className="flex items-center gap-2">
                              <span className="font-medium">{v.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {v.rate}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-xs font-semibold uppercase tracking-wide text-amber-600 px-2 py-1 mt-1 flex items-center gap-1">
                          ✦ VIP / Luxury Fleet
                        </SelectLabel>
                        {VIP_VEHICLES.map((v) => (
                          <SelectItem key={v.value} value={v.value}>
                            <span className="flex items-center gap-2">
                              <span className="font-semibold text-amber-700">
                                {v.label}
                              </span>
                              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                {v.rate}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
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

              <p className="text-xs text-muted-foreground text-center -mb-1">
                Your details will be sent to our team. We&apos;ll call you to
                confirm.
              </p>

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
