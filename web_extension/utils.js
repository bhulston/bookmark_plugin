import {
	blackListedDomains,
	youtubeDomains,
} from './config'

function ISO8601DurationToSeconds (duration) {
	let seconds = duration.match(/(\d*)S/)
	seconds = parseInt(seconds ? (parseInt(seconds[1], 10) ? seconds[1] : 0) : 0, 10)

	let minutes = duration.match(/(\d*)M/)
	minutes = parseInt(minutes ? (parseInt(minutes[1], 10) ? minutes[1] : 0) : 0, 10)

	let hours = duration.match(/(\d*)H/)
	hours = parseInt(hours ? (parseInt(hours[1], 10) ? hours[1] : 0) : 0, 10)

	let totalSeconds =
		(hours * 60 * 60) +
		(minutes * 60) +
		seconds

	return totalSeconds
}

function contentWarning (data) {
	return data &&
			data.contentDetails.contentRating &&
			data.contentDetails.contentRating.ytRating &&
			data.contentDetails.contentRating.ytRating === 'ytAgeRestricted'
}

// Check if the users country is allowed to view the video
function regionAllowed (countryCode, contentDetails) {
	// Implicitly allowed
	if (!countryCode || !contentDetails.regionRestriction) {
		return true
	}

	const regionRestriction = contentDetails.regionRestriction

	// Explicitly allowed
	if (regionRestriction.allowed && regionRestriction.allowed.includes(countryCode)) {
		return true
	}

	// Explicitly blocked
	if (regionRestriction.blocked && regionRestriction.blocked.includes(countryCode)) {
		return false
	}

	// Implicitly allowed
	return true
}

const blackListedDomainsRegex = new RegExp(`^(www.)?(${blackListedDomains.join('|')})$`)
function isDomainBlacklisted (hostname) {
	return blackListedDomainsRegex.test(hostname)
}

const youtubeDomainRegex = new RegExp(`^(www.)?(${youtubeDomains.join('|')})$`)
function isYoutubeDomain (hostname) {
	return youtubeDomainRegex.test(hostname)
}

export {
	contentWarning,
	isDomainBlacklisted,
	ISO8601DurationToSeconds,
	isYoutubeDomain,
	prettyPrintSeconds,
	regionAllowed,
}