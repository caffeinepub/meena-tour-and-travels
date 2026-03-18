import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";

actor {
  type PackageId = Nat;
  type DestinationId = Nat;
  type TestimonialId = Nat;
  type BookingId = Nat;

  type TourPackage = {
    id : PackageId;
    name : Text;
    description : Text;
    duration : Nat;
    price : Float;
    rating : Float;
    imageUrl : Text;
    destinations : [DestinationId];
  };

  type Destination = {
    id : DestinationId;
    name : Text;
    imageUrl : Text;
    country : Text;
  };

  type Testimonial = {
    id : TestimonialId;
    name : Text;
    avatarUrl : Text;
    rating : Float;
    review : Text;
  };

  type BookingRequest = {
    id : BookingId;
    fullName : Text;
    mobile : Text;
    pickup : Text;
    destination : Text;
    travelDate : Text;
    passengers : Text;
    vehicleType : Text;
    special : Text;
    submittedAt : Int;
  };

  module TourPackage {
    public func compare(pkg1 : TourPackage, pkg2 : TourPackage) : Order.Order {
      Nat.compare(pkg1.id, pkg2.id);
    };
  };

  module Destination {
    public func compare(dest1 : Destination, dest2 : Destination) : Order.Order {
      Nat.compare(dest1.id, dest2.id);
    };
  };

  module Testimonial {
    public func compare(test1 : Testimonial, test2 : Testimonial) : Order.Order {
      Nat.compare(test1.id, test2.id);
    };
  };

  module BookingRequest {
    public func compare(b1 : BookingRequest, b2 : BookingRequest) : Order.Order {
      Nat.compare(b2.id, b1.id);
    };
  };

  var nextPackageId : PackageId = 1;
  var nextDestinationId : DestinationId = 1;
  var nextTestimonialId : TestimonialId = 1;
  var nextBookingId : BookingId = 1;

  let packages = Map.empty<PackageId, TourPackage>();
  let destinations = Map.empty<DestinationId, Destination>();
  let testimonials = Map.empty<TestimonialId, Testimonial>();
  let bookings = Map.empty<BookingId, BookingRequest>();

  public func submitBooking(
    fullName : Text,
    mobile : Text,
    pickup : Text,
    destination : Text,
    travelDate : Text,
    passengers : Text,
    vehicleType : Text,
    special : Text,
  ) : async BookingRequest {
    let booking : BookingRequest = {
      id = nextBookingId;
      fullName;
      mobile;
      pickup;
      destination;
      travelDate;
      passengers;
      vehicleType;
      special;
      submittedAt = Time.now();
    };
    bookings.add(nextBookingId, booking);
    nextBookingId += 1;
    booking;
  };

  public query func getAllBookings() : async [BookingRequest] {
    bookings.values().toArray().sort();
  };

  public shared ({ caller }) func addTourPackage(
    name : Text,
    description : Text,
    duration : Nat,
    price : Float,
    rating : Float,
    imageUrl : Text,
    destinationIds : [DestinationId],
  ) : async TourPackage {
    let newPackage : TourPackage = {
      id = nextPackageId;
      name; description; duration; price; rating; imageUrl;
      destinations = destinationIds;
    };
    packages.add(nextPackageId, newPackage);
    nextPackageId += 1;
    newPackage;
  };

  public shared ({ caller }) func updateTourPackage(
    id : PackageId,
    name : Text,
    description : Text,
    duration : Nat,
    price : Float,
    rating : Float,
    imageUrl : Text,
    destinationIds : [DestinationId],
  ) : async TourPackage {
    if (not packages.containsKey(id)) { Runtime.trap("Tour Package with id " # id.toText() # " does not exist") };
    let updatedPackage : TourPackage = {
      id; name; description; duration; price; rating; imageUrl;
      destinations = destinationIds;
    };
    packages.add(id, updatedPackage);
    updatedPackage;
  };

  public shared ({ caller }) func deleteTourPackage(id : PackageId) : async () {
    if (not packages.containsKey(id)) { Runtime.trap("Tour Package with id " # id.toText() # " does not exist") };
    packages.remove(id);
  };

  public shared ({ caller }) func addDestination(
    name : Text,
    imageUrl : Text,
    country : Text,
  ) : async Destination {
    let newDestination : Destination = {
      id = nextDestinationId;
      name; imageUrl; country;
    };
    destinations.add(nextDestinationId, newDestination);
    nextDestinationId += 1;
    newDestination;
  };

  public shared ({ caller }) func updateDestination(
    id : DestinationId,
    name : Text,
    imageUrl : Text,
    country : Text,
  ) : async Destination {
    if (not destinations.containsKey(id)) { Runtime.trap("Destination with id " # id.toText() # " does not exist") };
    let updatedDestination : Destination = { id; name; imageUrl; country; };
    destinations.add(id, updatedDestination);
    updatedDestination;
  };

  public shared ({ caller }) func deleteDestination(id : DestinationId) : async () {
    if (not destinations.containsKey(id)) { Runtime.trap("Destination with id " # id.toText() # " does not exist") };
    destinations.remove(id);
  };

  public shared ({ caller }) func addTestimonial(
    name : Text,
    avatarUrl : Text,
    rating : Float,
    review : Text,
  ) : async Testimonial {
    let newTestimonial : Testimonial = {
      id = nextTestimonialId;
      name; avatarUrl; rating; review;
    };
    testimonials.add(nextTestimonialId, newTestimonial);
    nextTestimonialId += 1;
    newTestimonial;
  };

  public shared ({ caller }) func updateTestimonial(
    id : TestimonialId,
    name : Text,
    avatarUrl : Text,
    rating : Float,
    review : Text,
  ) : async Testimonial {
    if (not testimonials.containsKey(id)) { Runtime.trap("Testimonial with id " # id.toText() # " does not exist") };
    let updatedTestimonial : Testimonial = { id; name; avatarUrl; rating; review; };
    testimonials.add(id, updatedTestimonial);
    updatedTestimonial;
  };

  public shared ({ caller }) func deleteTestimonial(id : TestimonialId) : async () {
    if (not testimonials.containsKey(id)) { Runtime.trap("Testimonial with id " # id.toText() # " does not exist") };
    testimonials.remove(id);
  };

  public query ({ caller }) func getAllTourPackages() : async [TourPackage] {
    packages.values().toArray().sort();
  };

  public query ({ caller }) func getAllDestinations() : async [Destination] {
    destinations.values().toArray().sort();
  };

  public query ({ caller }) func getAllTestimonials() : async [Testimonial] {
    testimonials.values().toArray().sort();
  };

  public query ({ caller }) func getTourPackageById(id : PackageId) : async TourPackage {
    switch (packages.get(id)) {
      case (null) { Runtime.trap("Tour package with id " # id.toText() # " does not exist") };
      case (?package) { package };
    };
  };

  public query ({ caller }) func getDestinationById(id : DestinationId) : async Destination {
    switch (destinations.get(id)) {
      case (null) { Runtime.trap("Destination with id " # id.toText() # " does not exist") };
      case (?destination) { destination };
    };
  };

  public query ({ caller }) func getTestimonialById(id : TestimonialId) : async Testimonial {
    switch (testimonials.get(id)) {
      case (null) { Runtime.trap("Testimonial with id " # id.toText() # " does not exist") };
      case (?testimonial) { testimonial };
    };
  };
};
