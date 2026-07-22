; RSS-Bridge configuration
; https://github.com/RSS-Bridge/rss-bridge

[system]
; Enable/disable admin panel
admin = true

[cache]
type = "file"
; Cache time in seconds (3600 = 1 hour)
timeout = 3600

[whitelist]
; When enabled, only listed bridges are usable. 
; Set to true to enable whitelist
enabled = true
; List of allowed bridges (one per line)
bridges[] = "GoogleSearch"
bridges[] = "Reddit"
bridges[] = "HackerNews"
bridges[] = "YouTube"
bridges[] = "FilterBridge"
bridges[] = "JsonFeed"

[google_search]
; Google Search bridge settings
language = "en"
tld = "com"

[reddit]
; Reddit bridge settings
user_agent = "RSS-Bridge/1.0"

[youtube]
; YouTube bridge settings
api_key = ""
