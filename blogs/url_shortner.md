## scaleable url shortner blog 
## there will be another blog discussing the code and technical stuff 
## post updates of new features on linkedin
- simple url shortner 
- problems with simple shortner 
- problems faced while scaling a url shortner 
- my solution
- link to my git repository 


### what is an url shortner app 
long urls are hard to remeber and seem ugly , assuming we have provide a link of our resume which is hosted on a public google drive from our google account , the link is going to be very long an ugly . a url shortner can solve this problem , given a long url it will give us a much smaller plesent looking url , that we can share and attach in places without taking much space 

so A url shortner app is basically where users can enter a long url and get a samller url in return 

### what actions do we take in a url shortnet app 
to design a url shortner lets break down its baisc features 
- login / register 
- shorten a url 
- retrieve original url from shortened url 
- list all shortened urls 

we will be discussing shortning and retrieveing operation 

### shortning a url 

to make a url short we need a short code or string . so how can we get this string 
1. we can generate random string 
2. we can hash the large url but since hashes are very long so take portions of it 

problem with both approch is chances of collision , say we generate a random string or hash our for our original url and take portions from the hash and lets call this string "code", everytime we want to shortened a url we would require to generate a unique code  , so we will have to make sure that the string does not exist on the database which will require a search operation . 

or we could just put in a unique constrain for the code column , but in this case if same code already exists in db there will be a constrain violation and we would need to generate the code agian , so for N collisions we would require to generate the code N times, as our database grow changes of collision become very high 

### retrieve original url 

we would require to get the origianl url from the code ,for this we can create an index of the code column  to make search operations faster 


# A better apprich by aviding collision and making retrival faster 
our current code generation process does not ensure uniqueness by default we would have to check if it already exists , which is not very effiecient .  What if we could generate code in a way that it is gaurenteed to be unique , so hear it is 
- we would generate code form a pre determined range of number say from 10,000 to 90,000
- we would have a counter in our server indication the current number for code generation 
- we will convert the number to a higher base to make it shorter and represent the shortened code 

## :todo put a diagram hear 

# issues while scaling 

now what if we want to scale our app vertically , lets assume we want 3 instances of our app backend 
so what are the issues that we are going to face 
 
 - earlier we provided server with a server range of numbers
 - so now we are going to need a range of numbers for each server
 - now what will happen when a server has exausted all the numbers at its given range 
 - or if a new server instance joins how are we going assign a number range 
 - and what if a server crashes and a new instance has to replaces it , how is the new instance going pick up from where the old server left 

 # solution 
 We can use a distributed config manager for coordinating the range configuirations among the server , it would 
 - store a list of ranges to distribute 
 - assign a new range when a new server joins and lock that range
 - when a server crashes the range would be unlocked and available for other servers agian , so new server could pick up from where the old one left 
 - when a server runs out of range , it would mark that rnges tobe used and assign a new range 

 ## :todo put a diagram or image hear 

 so how to build this config manager ?? 

 Introducing ApacheZookeeper , it is a distributed config manager developed by the Apache foundation 
 it is used along with other apache products such as ApacheKafka for leder election and distributed config management 

 to learn more about apache zookeeper check out this blog [apache zookeeper](https://google.com) 
 and for walkthrough and Implementation with nodejs of Scleable URL shortnet checkout this blog 