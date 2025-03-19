import { IStorage } from "./types";
import { User, InsertUser, HealthCard, Partner, UserCard } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private healthCards: Map<number, HealthCard>;
  private partners: Map<number, Partner>;
  private userCards: Map<number, UserCard>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.healthCards = new Map();
    this.partners = new Map();
    this.userCards = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Initialize with mock data
    this.initializeMockData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId++;
    const newUser: User = {
      id,
      username: user.username,
      password: user.password,
      fullName: user.fullName ?? null,
      email: user.email ?? null
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async getHealthCards(): Promise<HealthCard[]> {
    return Array.from(this.healthCards.values());
  }

  async getHealthCard(id: number): Promise<HealthCard | undefined> {
    return this.healthCards.get(id);
  }

  async getPartners(): Promise<Partner[]> {
    return Array.from(this.partners.values());
  }

  async getUserCards(userId: number): Promise<UserCard[]> {
    return Array.from(this.userCards.values()).filter(
      (card) => card.userId === userId
    );
  }

  async applyForCard(userId: number, cardId: number): Promise<UserCard> {
    const id = this.currentId++;
    const userCard: UserCard = {
      id,
      userId,
      cardId,
      status: "pending",
      appliedAt: new Date().toISOString(),
    };
    this.userCards.set(id, userCard);
    return userCard;
  }

  private initializeMockData() {
    // Health Cards
    const cards: HealthCard[] = [
      {
        id: 1,
        name: "Essential Care",
        tier: "Basic",
        monthlyPremium: 99,
        benefits: [
          "General Practitioner Visits",
          "Basic Dental Care",
          "Emergency Services",
          "Preventive Care"
        ],
        coverageLimit: 50000,
        description: "Affordable healthcare coverage for essential medical needs"
      },
      {
        id: 2,
        name: "Premium Health",
        tier: "Gold",
        monthlyPremium: 299,
        benefits: [
          "Specialist Consultations",
          "Advanced Dental Care",
          "Mental Health Services",
          "Physiotherapy",
          "Prescription Coverage"
        ],
        coverageLimit: 150000,
        description: "Comprehensive healthcare coverage with premium benefits"
      }
    ];

    // Partners
    const partners: Partner[] = [
      {
        id: 1,
        name: "City General Hospital",
        type: "Hospital",
        location: "Downtown Medical District",
        description: "Leading healthcare facility with state-of-the-art equipment",
        services: ["Emergency Care", "Surgery", "Diagnostics", "Specialized Care"]
      },
      {
        id: 2,
        name: "Wellness Plus Clinic",
        type: "Clinic",
        location: "Suburban Health Center",
        description: "Family-focused healthcare provider",
        services: ["Primary Care", "Pediatrics", "Vaccinations"]
      }
    ];

    cards.forEach(card => this.healthCards.set(card.id, card));
    partners.forEach(partner => this.partners.set(partner.id, partner));
  }
}

export const storage = new MemStorage();