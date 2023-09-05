# wif-job-recommendations

Productizer for job recommendations data product

Example:

```
curl --location 'https://gateway.testbed.fi/draft/Employment/ForeignerJobRecommendatations?source=vfd_jif' \
--header 'Content-Type: application/json' \
--data '{
    "offset": 0,
    "limit": 1000,
    "freeText": "Driving",
    "preferredMunicipalities": ["091"],
    "citizenshipArea": "EEA",
    "escoCodes": ["8331.1"]
}'
```
