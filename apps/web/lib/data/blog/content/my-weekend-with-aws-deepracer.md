---
title: 'My weekend with AWS DeepRacer'
description: 'Here are the results of my weekend playing around with AWS DeepRacer'
date: 'Sunday, May 19 2019 3:32 pm'
archived: true
---

Last weekend marked the beginning of Amazon's new virtual DeepRacer league, which is basically a race that is conducted within Amazon's platform by a bunch of simulated versions of the DeepRacer vehicle.

Developers battle it out in this league not by their driving skill but by their knowledge of the AWS platform and their ability to effectively create and train a DeepRacer model on AWS' platform. As you can tell by the title, this was immediately something that I thought I would be interested in, if not at least just for the weekend and I'd have to say that I definitely had fun doing it.

## Getting Started

The whole process of getting started with AWS DeepRacer and concept of Reinforcement Learning is a slightly scary one at first sight, this is something that you've probably never done before and at times, Amazon's slightly jarring interface can be a little confusing.

Thankfully, it isn't actually that hard to do. Simply head on over to the [AWS DeepRacer](https://console.aws.amazon.com/deepracer/) page in your console and hit the orange 'Get Started' button, that will take you to another page where you need to click another button in order to create the resources required.

![]()

There's also a link to a document about learning RL on this page that you should definitely check out.

Once you've done all that, you are ready to start making some models and get spending some money and yes, you will have to spend a bit of money, DeepRacer is definitely not for the light of wallet, more on that later.

## Creating a DeepRacer model

So probably the hardest part of this journey with DeepRacer was the creation of RL models for use with the simulation, while the actual creation of the models simply involves some Python code that you can create in pretty much any IDE, getting a model correct can be a lot of trial and error and a lot of the time, you will end up with an error.

Sadly, a lot of your success will also be linked to the training settings that you select for your DeepRacer model and while you can do a lot with your own code, sometimes you might end up having to scrap all of the training that you have conducted in order to slightly change a setting with a value that is more than likely to be an utter guess.

Then you'll likely have to do at least an hour or two of training before you can get racing.

That said, I can't say that I didn't find the experience enjoyable, nor that I didn't learn anything from, nor that I didn't have any fun.

![]()

As you can see from the GIF above, there are a lot of options, but it actually isn't that hard to get one going fast.

In total, I created 19 models over the weekend, and each one gradually started to get a little better, somewhat smarter and a lot faster.

At the start, I decided to use one of Amazon's templates to see how everything worked and to get a quick glimpse into what I could expect, so i used the following function, which is designed to train to car to keep within the two borders and hopefully on the center line.

```python
def reward_function(params):
    '''
    Example of rewarding the agent to follow center line
    '''
    # Read input parameters
    track_width = params['track_width']
    distance_from_center = params['distance_from_center']
    # Calculate 3 markers that are at varying distances away from the center line
    marker_1 = 0.1 * track_width
    marker_2 = 0.25 * track_width
    marker_3 = 0.5 * track_width
    # Give higher reward if the car is closer to center line and vice versa
    if distance_from_center <= marker_1:
    reward = 1.0
    elif distance_from_center <= marker_2:
    reward = 0.5
    elif distance_from_center <= marker_3:
    reward = 0.1
    else:
    reward = 1e-3  # likely crashed/ close to off track
    return float(reward)
```

As you can see it is actually quite simple but involves quite a lot of math. The premise is that the more that your car does what you want it to, the more reward value you provide. if it does something that you don't want itt to, you take the reward away.

So in this example, the car will get the highest reward if it is closer to the center line.

For this first one, I did only that and then used the default settings.

![]()

The great thing about DeepRacer is that you can actually watch a live stream of your model training in the simulation while it is doing so. This means that you can quickly see where you could make optimisations to your model and what optimisations you should probably tone down.

Should your model look like it's not panning out, you can also quickly stoop the training and save some money.

Once my model had finished, I worked out that although it was occasionally steering to the center for those points, it was not staying there for a long period of time and even sometimes going off the track.

Thankfully, Amazon has already set up a range of parameters that will allow you to customise your reward function and get the most out of it.

```json
{
        "all_wheels_on_track": Boolean,
        # flag to indicate if the vehicle is on the track
        "x": float,
        # vehicle's x-coordinate in meters
        "y": float,
        # vehicle's y-coordinate in meters
        "distance_from_center": float,
        # distance in meters from the track center
        "is_left_of_center": Boolean,
        # Flag to indicate if the vehicle is on the left side to the track center or not.
        "heading": float,
        # vehicle's yaw in degrees
        "progress": float,
        # percentage of track completed
        "steps": int,
        # number steps completed
        "speed": float,
        # vehicle's speed in meters per second (m/s)
        "steering_angle": float,
        # vehicle's steering angle in degrees
        "track_width": float,
        # width of the track
        "waypoints": [[float, float], … ],
        # list of [x,y] as milestones along the track center
        "closest_waypoints": [int, int]
        # indices of the two nearest waypoints.
    }
```

So what I did was combine the default with a multiplier for the car's progress while being in the center of the track.

```python
     Give higher reward if the car is closer to center line and vice versa
     if distance_from_center <= marker_1:
        reward = 1.0 * progress
     elif distance_from_center <= marker_2:
        reward = 0.5
    elif distance_from_center <= marker_3:
        reward = 0.1
    else:
        reward = 1e-3  # likely crashed/ close to off track
```

I also wanted it to go faster, while not steering to much so I added the following:

```python
        # Add penalty if throttle exsides the steering else add reward     
        if abs(steering_angle) > 15 and abs(steering_angle > throttle):         
            reward *= 1 - (steering_angle - throttle)     
        else:         
            reward *= 1 + throttle
```

And then I had to increase the speed on the action parameters as well, this is the part where you have more risk in changing your parameters, as you can't change the parameters on a cloned model, only a new one and once you create a new model, you lose all of your progress and training, but keeping the defaults will definitely mean that you will not be able to progress through the league as much.

You can also play around with the HyperParameters to optimise your training, however, this is again a bit of trail and error.

For me, once I did that, I was able to get a good training session from my model and finally submitted my first decent score of 28:350 o the London Loop, which at the time put me at rank 145.

I then trained the model further and decreased that time too 25.932 at rank 115.

I was pretty happy at that point and I've left it there, gradually decreasing down to 155 between the time of me returning to my real job and writing this post.

![]()

Ultimately, for me, the whole process of creating code, testing it, reiterating it and then finally succeeding at a goal was great. As developers, we are often doing the same project month after month, not really moving between extremely different technologies and generally staying within the same lane that we started on.

For me, side-projects like creating a DeepRacer model over the weekend is a lot of fun, and although all  I really did was spend $70 on a simulation of a race for the achievement of a virtual score within a virtual league, I think I learned a lot from doing it.

## And that's it

Time to get testing!