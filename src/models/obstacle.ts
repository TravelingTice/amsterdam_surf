import * as THREE from "three"
import { createBicycle } from "./obstacles/bicycle"
import { createStudent } from "./obstacles/student"
import { createPartyBoat } from "./obstacles/party_boat/party_boat"

export function createObstacle(type: string): THREE.Group | THREE.Mesh {
  switch (type) {
    case "bicycle":
      return createBicycle()
    case "student":
      return createStudent()
    case "party_boat":
      return createPartyBoat()
    default:
      return createBicycle() // Default to bicycle if unknown type
  }
}
