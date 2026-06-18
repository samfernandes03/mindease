import Gamification from "../../models/Gamification.js";

export function getGamificationKey(userId) {
  return `gamification_${userId}`;
}

export function loadGamification(userId) {
  const savedData = JSON.parse(localStorage.getItem(getGamificationKey(userId)));

  return new Gamification(savedData || {});
}

export function saveGamification(userId, gamification) {
  localStorage.setItem(
    getGamificationKey(userId),
    JSON.stringify(gamification.toJSON())
  );
}

export function addMoodPoints(userId) {
  const gamification = loadGamification(userId);

  gamification.addMoodEntry(5);

  saveGamification(userId, gamification);

  return gamification;
}

export function addFocusPoints(userId) {
  const gamification = loadGamification(userId);

  gamification.addFocusSession(15);

  saveGamification(userId, gamification);

  return gamification;
}

export function addActivityPoints(userId, points = 10) {
  const gamification = loadGamification(userId);

  gamification.addCompletedActivity(points);

  saveGamification(userId, gamification);

  return gamification;
}