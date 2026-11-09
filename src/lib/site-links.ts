export const contactEmail = "Ericsgc@outlook.com"

const meetingFallback = `mailto:${contactEmail}?subject=15-minute%20systems%20chat`

export const meetingHref = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() || meetingFallback
export const meetingIsExternal = /^https?:\/\//.test(meetingHref)
