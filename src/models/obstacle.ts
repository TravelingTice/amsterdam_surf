import * as THREE from "three"
import { createBarrel } from "./obstacles/barrel"
import { createBicycle } from "./obstacles/bicycle"
import { createStudent } from "./obstacles/student"
import { createPartyBoat } from "./obstacles/party_boat"

export function createObstacle(type: string): THREE.Group | THREE.Mesh {
  switch (type) {
    case "barrel":
      return createBarrel()
    case "bicycle":
      return createBicycle()
    case "student":
      return createStudent()
    case "party_boat":
      return createPartyBoat()
    default:
      return createBarrel() // Default to barrel if unknown type
  }
}
