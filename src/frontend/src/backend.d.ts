import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type DestinationId = bigint;
export interface TourPackage {
    id: PackageId;
    duration: bigint;
    name: string;
    description: string;
    imageUrl: string;
    destinations: Array<DestinationId>;
    rating: number;
    price: number;
}
export interface Destination {
    id: DestinationId;
    country: string;
    name: string;
    imageUrl: string;
}
export type TestimonialId = bigint;
export type PackageId = bigint;
export interface Testimonial {
    id: TestimonialId;
    review: string;
    name: string;
    avatarUrl: string;
    rating: number;
}
export interface backendInterface {
    addDestination(name: string, imageUrl: string, country: string): Promise<Destination>;
    addTestimonial(name: string, avatarUrl: string, rating: number, review: string): Promise<Testimonial>;
    addTourPackage(name: string, description: string, duration: bigint, price: number, rating: number, imageUrl: string, destinationIds: Array<DestinationId>): Promise<TourPackage>;
    deleteDestination(id: DestinationId): Promise<void>;
    deleteTestimonial(id: TestimonialId): Promise<void>;
    deleteTourPackage(id: PackageId): Promise<void>;
    getAllDestinations(): Promise<Array<Destination>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getAllTourPackages(): Promise<Array<TourPackage>>;
    getDestinationById(id: DestinationId): Promise<Destination>;
    getTestimonialById(id: TestimonialId): Promise<Testimonial>;
    getTourPackageById(id: PackageId): Promise<TourPackage>;
    updateDestination(id: DestinationId, name: string, imageUrl: string, country: string): Promise<Destination>;
    updateTestimonial(id: TestimonialId, name: string, avatarUrl: string, rating: number, review: string): Promise<Testimonial>;
    updateTourPackage(id: PackageId, name: string, description: string, duration: bigint, price: number, rating: number, imageUrl: string, destinationIds: Array<DestinationId>): Promise<TourPackage>;
}
