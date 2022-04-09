# lepta-web

## Setup a web project
1. download a svg icon for logo from https://icons8.com/icon/set/atom/ios, or create one manually.
2. open the svg icon file and give it one or more color
3. upload the colored svg icon to some online svg->favicon services such as https://realfavicongenerator.net/
4. put the svg and all generated favicon files into /public folder of the web project 
5. go to https://www.douhub.com/developer/register-solution to register a solution. You will get a solution id, and use this solution id in all files in metadata folder.
6. create a solution folder in the s3 appName-us-prod-data bucket with the solution id as the name. 
7. upload all customized files in the metadata folder to the solution folder on s3.