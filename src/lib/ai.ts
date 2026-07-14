export async function getAIResponse(
  message: string,
  data: Record<string, unknown>
): Promise<string> {
  const { activeTrains, totalTrains, activeAlerts, criticalAlerts, activeTrips, totalPassengerCount, avgDelayMinutes, delayedTrips } = data as Record<string, number>
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('status') || lowerMessage.includes('overview') || lowerMessage.includes('summary') || lowerMessage.includes('حالة') || lowerMessage.includes('لخص')) {
    return `TrainEye AI Network Status Report:\n\nThe metro network currently has ${activeTrains} out of ${totalTrains} trains active.\n${activeTrips} trips are currently in progress.\nTotal passengers recorded: ${(totalPassengerCount ?? 0).toLocaleString()}.\nAverage delay: ${avgDelayMinutes ?? 0} minutes.\nActive alerts: ${activeAlerts} (${criticalAlerts} critical).\nNetwork health: ${(criticalAlerts ?? 0) === 0 ? 'Good' : 'Requires attention - ' + criticalAlerts + ' critical alert(s) active'}.`
  }
  if (lowerMessage.includes('alert') || lowerMessage.includes('warning') || lowerMessage.includes('تنبيه')) {
    return `Alert Summary:\n\nActive unacknowledged alerts: ${activeAlerts}\nCritical alerts: ${criticalAlerts}\n${(criticalAlerts ?? 0) > 0 ? 'Immediate attention recommended. There are ' + criticalAlerts + ' critical alert(s) that need to be addressed.' : 'No critical alerts at this time. System is operating normally.'}`
  }
  if (lowerMessage.includes('train') || lowerMessage.includes('fleet') || lowerMessage.includes('قطار')) {
    return `Fleet Status:\n\nTotal trains: ${totalTrains}\nActive: ${activeTrains}\nFleet utilization: ${totalTrains > 0 ? Math.round((activeTrains / totalTrains) * 100) : 0}%\n${(activeTrains ?? 0) < (totalTrains ?? 0) * 0.5 ? 'Warning: Fleet utilization is below 50%. Consider deploying more trains.' : 'Fleet utilization is at a healthy level.'}`
  }
  if (lowerMessage.includes('passenger') || lowerMessage.includes('ridership') || lowerMessage.includes('راكب') || lowerMessage.includes('مسافر')) {
    return `Passenger Statistics:\n\nTotal passengers recorded: ${(totalPassengerCount ?? 0).toLocaleString()}\nActive trips: ${activeTrips}\nAverage delay: ${avgDelayMinutes ?? 0} minutes\n${(totalPassengerCount ?? 0) > 50000 ? 'High ridership detected. Consider increasing train frequency.' : 'Ridership levels are within normal range.'}`
  }
  if (lowerMessage.includes('delay') || lowerMessage.includes('late') || lowerMessage.includes('تأخير')) {
    return `Delay Report:\n\nTrips currently delayed: ${delayedTrips}\nAverage delay: ${avgDelayMinutes ?? 0} minutes\nTotal trips today: ${(data as Record<string, number>).totalTrips ?? 0}\n${(avgDelayMinutes ?? 0) > 5 ? 'Average delay exceeds 5 minutes. Investigation recommended.' : 'Delays are within acceptable limits.'}`
  }

  return `I'm TrainEye AI, your metro network assistant.\n\nNetwork: ${activeTrains}/${totalTrains} trains active\nTrips: ${activeTrips} active, ${delayedTrips} delayed\nPassengers: ${(totalPassengerCount ?? 0).toLocaleString()} total\nAlerts: ${activeAlerts} active (${criticalAlerts} critical)\nAvg delay: ${avgDelayMinutes ?? 0} min\n\nYou can ask me about: network status, alerts, trains/fleet, passengers, or delays.`
}
