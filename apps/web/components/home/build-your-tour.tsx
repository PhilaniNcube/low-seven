"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check,  Compass, Hotel, Utensils, Camera, Plane, Map } from "lucide-react"

// These will eventually come from the activities table in the database
// Each activity has: id, name, description, imageUrl, location, durationMinutes, price
const sampleActivities = [
  {
    id: "shark-diving",
    name: "Shark Cage Diving",
    description: "Experience the thrill of diving with great white sharks",
    price: 450,
    location: "Gansbaai",
    durationMinutes: 240,
    icon: Compass,
  },
  {
    id: "wine-tasting",
    name: "Wine Estate Tour",
    description: "Explore renowned wine estates with premium tastings",
    price: 120,
    location: "Stellenbosch",
    durationMinutes: 180,
    icon: Utensils,
  },
  {
    id: "safari-tour",
    name: "Big Five Safari",
    description: "Full-day safari adventure in a private game reserve",
    price: 380,
    location: "Kruger National Park",
    durationMinutes: 480,
    icon: Camera,
  },
  {
    id: "table-mountain",
    name: "Table Mountain Hike",
    description: "Guided hike to the summit with breathtaking views",
    price: 80,
    location: "Cape Town",
    durationMinutes: 240,
    icon: Plane,
  },
  {
    id: "cultural-tour",
    name: "Township Cultural Experience",
    description: "Authentic cultural immersion with local guides",
    price: 100,
    location: "Cape Town",
    durationMinutes: 180,
    icon: Map,
  },
  {
    id: "coastal-drive",
    name: "Chapman's Peak Scenic Drive",
    description: "Private chauffeur-driven coastal tour",
    price: 150,
    location: "Cape Peninsula",
    durationMinutes: 300,
    icon: Hotel,
  },
]

export function BuildYourTour() {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])


  const toggleActivity = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const calculateTotal = () => {
    return sampleActivities
      .filter((activity) => selectedActivities.includes(activity.id))
      .reduce((total, activity) => {
        return total + activity.price
      }, 0)
  }

  const calculateTotalDuration = () => {
    const totalMinutes = sampleActivities
      .filter((activity) => selectedActivities.includes(activity.id))
      .reduce((total, activity) => total + activity.durationMinutes, 0)
    
    const hours = Math.floor(totalMinutes / 60)
    const days = Math.ceil(hours / 8) // Assuming 8 hours of activities per day
    return { hours, days }
  }

  const { hours: totalHours, days: estimatedDays } = calculateTotalDuration()

  return (
    <section id="build-tour" className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">
              Customize
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Build Your Custom Tour
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Select from our curated activities to create your personalized travel experience. 
              Each activity is led by expert guides and can be scheduled according to your preferences.
            </p>

            <div className="grid gap-4">
              {sampleActivities.map((activity) => {
                const Icon = activity.icon
                const isSelected = selectedActivities.includes(activity.id)
                return (
                  <Card
                    key={activity.id}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => toggleActivity(activity.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            isSelected ? "text-primary-foreground" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{activity.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {Math.floor(activity.durationMinutes / 60)}h {activity.durationMinutes % 60 > 0 ? `${activity.durationMinutes % 60}m` : ''}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Map className="h-3 w-3" />
                          {activity.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">${activity.price}</p>
                        <p className="text-xs text-muted-foreground">per person</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <Card className="border-0 shadow-xl bg-card">
              <CardContent className="p-8">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Your Custom Itinerary
                </h3>

                {selectedActivities.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Compass className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select activities to build your custom tour</p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-8">
                    {sampleActivities
                      .filter((activity) => selectedActivities.includes(activity.id))
                      .map((activity) => (
                        <div key={activity.id} className="flex justify-between items-start py-2 border-b border-border">
                          <div className="flex-1">
                            <span className="text-foreground font-medium">{activity.name}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {Math.floor(activity.durationMinutes / 60)}h
                              </Badge>
                              <span className="text-xs text-muted-foreground">{activity.location}</span>
                            </div>
                          </div>
                          <span className="font-medium text-foreground ml-4">
                            ${activity.price}
                          </span>
                        </div>
                      ))}
                  </div>
                )}

                {selectedActivities.length > 0 && (
                  <>
                    <div className="border-t-2 border-border pt-4 mb-6 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total Duration</span>
                        <span className="text-foreground">{totalHours} hours</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Estimated Days</span>
                        <span className="text-foreground">{estimatedDays} {estimatedDays === 1 ? "Day" : "Days"}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Activities Selected</span>
                        <span className="text-foreground">{selectedActivities.length}</span>
                      </div>
                    </div>

                    <div className="bg-muted rounded-xl p-6 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-foreground">Total Estimated</span>
                        <span className="text-3xl font-bold text-primary">${calculateTotal()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Base price per person</p>
                    </div>
                  </>
                )}

                <Button className="w-full" size="lg" disabled={selectedActivities.length === 0}>
                  Request Custom Quote
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  No commitment required. Our team will create a personalized itinerary and contact you within 24 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
